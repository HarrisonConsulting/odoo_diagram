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

    diagram = fields.Char(string=_("Diagram"), copy=False,
                          help="Stores the name of the diagram associated with the article.")
    diagram_version_id = fields.Many2one("diagram.version",
                                         string=_("Diagram Versions"),
                                         domain="[('article_id','=', id)]",
                                         help="Links the diagram versions to this knowledge article."
                                         )
    show_load_diagram = fields.Boolean(string='Show Diagram',
                                       help="Indicates whether to display the diagram for this article.")

    def write(self, vals):
        """ Override the write method to handle diagram saving and versioning.

            If a new diagram is provided and 'save_diagram' is set, this method:
                - Creates a new diagram version record.
                - Sets a timestamped diagram name. """
        if vals.get('diagram', False) and vals.get('save_diagram', False):
            del vals['save_diagram']
            timezone = self._context.get(
                'tz') or self.env.user.partner_id.tz or 'UTC'
            self_tz = self.with_context(tz=timezone)
            date = fields.Datetime.context_timestamp(self_tz,
                                                     fields.Datetime.now())
            diagram_name = _(
                f"{date.strftime('%Y-%m-%d %H:%M:%S')} - {self.name}")
            # Store the saved diagram as a record to future use
            self.env["diagram.version"].create({
                'name': diagram_name,
                'diagram_xml': vals.get('diagram'),
                'article_id': self.id,
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
        if self.diagram_version_id:
            self.diagram = self.diagram_version_id.diagram_xml
            self.show_load_diagram = True

    def update_show_load_diagram(self):
        '''Set field show_load_diagram to Flase to hide the button '''
        self.show_load_diagram = False
