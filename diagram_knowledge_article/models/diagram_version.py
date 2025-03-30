# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class DiagramVersion(models.Model):
    _inherit = "diagram.version"
    
    article_id = fields.Many2one('knowledge.article', string="Knowledge Article",
                                help="The knowledge article this diagram is related to.")
    
    @api.model_create_multi
    def create(self, vals_list):
        # Pre-process values to set reference_model and reference_id
        for vals in vals_list:
            if vals.get('article_id') and not vals.get('reference_model'):
                vals['reference_model'] = 'knowledge.article'
                vals['reference_id'] = vals['article_id']
                
        return super(DiagramVersion, self).create(vals_list)