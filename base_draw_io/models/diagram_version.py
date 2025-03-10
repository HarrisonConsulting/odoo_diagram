# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class DiagramVersion(models.Model):
    _name = "diagram.version"
    _description = "Stores Diagram xml data"
    _order = "create_date DESC"
    _rec_name = "name"

    name = fields.Char()
    diagram_xml = fields.Text()
