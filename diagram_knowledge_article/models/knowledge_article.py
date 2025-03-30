# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class KnowledgeArticle(models.Model):
    """ Extends the 'knowledge.article' model to add diagram-related fields.

        This model introduces:
            - A field to store the diagram name.
            - A Many2one field to link diagram versions to knowledge articles.
            - A Boolean to control whether the diagram is shown.
        """
    _inherit = 'knowledge.article'

    diagram = fields.Char(string="Diagram", copy=False,
                         help="Stores the XML representation of the diagram for this article.")
    diagram_version_id = fields.Many2one("diagram.version", string="Diagram Versions", 
                                       domain="[('reference_model', '=', 'knowledge.article'), ('reference_id', '=', id)]",
                                       help="Reference to previous versions of this diagram.")
    show_load_diagram = fields.Boolean(string="Show Load Diagram Button",
                                     help="Technical field to control visibility of the load diagram button.")

    def write(self, vals):
        """ Override the write method to handle diagram saving and versioning.

            If a new diagram is provided and 'save_diagram' is set, this method:
                - Creates a new diagram version record.
                - Sets a timestamped diagram name. """
        if vals.get('diagram') and vals.get('save_diagram'):
            del vals['save_diagram']
            for record in self:
                timezone = self._context.get('tz') or self.env.user.partner_id.tz or 'UTC'
                self_tz = record.with_context(tz=timezone)
                date = fields.Datetime.context_timestamp(self_tz, fields.Datetime.now())
                diagram_name = _(f"{date.strftime('%Y-%m-%d %H:%M:%S')} - {record.name}")
                
                # Create diagram version using the generic reference-based approach
                self.env["diagram.version"].create({
                    'name': diagram_name,
                    'diagram_xml': vals.get('diagram'),
                    'reference_model': 'knowledge.article',
                    'reference_id': record.id,
                })
                
        return super(KnowledgeArticle, self).write(vals)

    @api.onchange('diagram_version_id')
    def onchange_diagram_version_id(self):
        """ Update 'diagram' and 'show_load_diagram' fields when
        'diagram_version_id' is changed.
            This method:
                - Loads the diagram XML from the selected version.
                - Sets the 'show_load_diagram' flag to True to display
                the diagram.  """
        for record in self:
            if record.diagram_version_id:
                record.diagram = record.diagram_version_id.diagram_xml
                record.show_load_diagram = True

    def update_show_load_diagram(self):
        """Set field show_load_diagram to False to hide the button"""
        self.show_load_diagram = False
