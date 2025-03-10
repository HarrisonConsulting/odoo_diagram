# -*- coding: utf-8 -*-
from odoo import fields, models, _


class DiagramVersion(models.Model):
    """ Inherits from 'diagram.version' to extend its functionality. """
    _inherit = "diagram.version"

    article_id = fields.Many2one('knowledge.article', string='Article',
                                 help="Link this diagram version to a specific "
                                      "knowledge article. This allows you to"
                                      " associate the diagram version with an"
                                      "article in the knowledge management "
                                      "system.")
