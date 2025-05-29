# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request


class ArticleDiagram(http.Controller):

    @http.route('/fetch_diagram', type='json', auth='public')
    def fetch_diagram(self, resId):
        diagram = request.env['knowledge.article'].sudo().browse(resId).diagram
        return diagram
