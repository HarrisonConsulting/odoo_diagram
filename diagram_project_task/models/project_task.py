# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

PROJECT_TASK_READABLE_FIELDS = {
    'show_load_diagram',
    'diagram_version_id',
    'diagram_publish_on_portal',
}

PROJECT_TASK_WRITABLE_FIELDS = {
    'diagram',
}


class ProjectTask(models.Model):
    _inherit = "project.task"
    
    diagram = fields.Char(string="Diagram", copy=False,
                         help="Stores the XML representation of the diagram for this task.")
    diagram_version_id = fields.Many2one("diagram.version", string="Diagram Versions", 
                                        domain="[('reference_model', '=', 'project.task'), ('reference_id', '=', id)]",
                                        help="Reference to previous versions of this diagram.")
    show_load_diagram = fields.Boolean(string="Show Load Diagram Button",
                                      help="Technical field to control visibility of the load diagram button.")
    diagram_publish_on_portal = fields.Boolean(string="Publish Diagram on Portal", default=False,
                                             help="If enabled, the diagram will be visible to portal users viewing this task.")
    
    def write(self, vals):
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
                    'reference_model': 'project.task',
                    'reference_id': record.id,
                })
                
        return super(ProjectTask, self).write(vals)
    
    @api.onchange('diagram_version_id')
    def onchange_diagram_version_id(self):
        for record in self:
            if record.diagram_version_id:
                record.diagram = record.diagram_version_id.diagram_xml
                record.show_load_diagram = True
    
    def update_show_load_diagram(self):
        """Set field show_load_diagram to False to hide the button"""
        self.show_load_diagram = False
    
    @property
    def SELF_READABLE_FIELDS(self):
        return super().SELF_READABLE_FIELDS | PROJECT_TASK_READABLE_FIELDS

    @property
    def SELF_WRITABLE_FIELDS(self):
        return super().SELF_WRITABLE_FIELDS | PROJECT_TASK_WRITABLE_FIELDS