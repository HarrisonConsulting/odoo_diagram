# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class DiagramVersion(models.Model):
    _inherit = "diagram.version"
    
    task_id = fields.Many2one('project.task', string="Task",
                              help="The project task this diagram is related to.")
    
    @api.model_create_multi
    def create(self, vals_list):
        # Pre-process values to set reference_model and reference_id
        for vals in vals_list:
            if vals.get('task_id') and not vals.get('reference_model'):
                vals['reference_model'] = 'project.task'
                vals['reference_id'] = vals['task_id']
                
        return super(DiagramVersion, self).create(vals_list)