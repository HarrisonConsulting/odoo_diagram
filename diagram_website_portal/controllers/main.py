# -*- coding: utf-8 -*-

from odoo import http
from odoo.http import request


class TaskController(http.Controller):

    @http.route('/web/load_data', type='json', auth='public', methods=['POST'],
                csrf=False)
    def load_data(self, res_model, res_id):
        # Fetch the data based on the model and ID passed
        record = request.env[res_model].browse(res_id)
        # Check if the record exists
        if not record.exists():
            return {'error': 'Record not found'}
        # Return the required fields (example here: 'diagram' and 'diagram_version_id')
        return {
            'record': record,
            'diagram': record.diagram if record.diagram else '',
            'diagram_version_id': record.diagram_version_id,
        }

    @http.route('/web/save_diagram', type='json', auth='public',
                methods=['POST'], csrf=False)
    def save_diagram(self, res_model, res_id, diagram_xml, save_diagram):
        # Ensure the record exists before updating
        record = request.env[res_model].browse(res_id)
        if not record.exists():
            return {'error': 'Record not found'}
        # Update the record with the new diagram data
        # Assuming 'diagram' is a field where you store the XML data
        record.sudo().write({
            'diagram': diagram_xml,  # Save the diagram XML
            'save_diagram': save_diagram  # Add additional flags as necessary
        })
        return {'status': 'success'}
