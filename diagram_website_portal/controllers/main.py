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

    @http.route('/web/view_diagram', type='json', auth='public',
                methods=['POST'], csrf=False)
    def view_diagram(self, res_model, res_id):
        # Ensure the record exists before updating
        record = request.env[res_model].browse(res_id)
        if not record.exists():
            return {'error': 'Record not found'}
        # Update the record with the new diagram data
        # Assuming 'diagram' is a field where you store the XML data
        url = f'https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=#R{record.diagram}'
        # url = 'https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=#R%3Cmxfile%20host=%22embed.diagrams.net%22%20agent=%22Mozilla/5.0%20(X11;%20Linux%20x86_64)%20AppleWebKit/537.36%20(KHTML,%20like%20Gecko)%20Chrome/130.0.0.0%20Safari/537.36%22%20version=%2226.0.6%22%3E%20%3Cdiagram%20id=%22h8417y_2Co3IN_Bi5ury%22%20name=%22Page-1%22%3E%20%3CmxGraphModel%20dx=%221023%22%20dy=%22583%22%20grid=%221%22%20gridSize=%2210%22%20guides=%221%22%20tooltips=%221%22%20connect=%221%22%20arrows=%221%22%20fold=%221%22%20page=%221%22%20pageScale=%221%22%20pageWidth=%22827%22%20pageHeight=%221169%22%20math=%220%22%20shadow=%220%22%3E%20%3Croot%3E%20%3CmxCell%20id=%220%22%20/%3E%20%3CmxCell%20id=%221%22%20parent=%220%22%20/%3E%20%3CmxCell%20id=%222%22%20value=%22%22%20style=%22rounded=0;whiteSpace=wrap;html=1;%22%20vertex=%221%22%20parent=%221%22%3E%20%3CmxGeometry%20x=%22270%22%20y=%2270%22%20width=%22120%22%20height=%2260%22%20as=%22geometry%22%20/%3E%20%3C/mxCell%3E%20%3CmxCell%20id=%224%22%20value=%22%22%20style=%22ellipse;whiteSpace=wrap;html=1;aspect=fixed;%22%20vertex=%221%22%20parent=%221%22%3E%20%3CmxGeometry%20x=%22320%22%20y=%22160%22%20width=%2280%22%20height=%2280%22%20as=%22geometry%22%20/%3E%20%3C/mxCell%3E%20%3C/root%3E%20%3C/mxGraphModel%3E%20%3C/diagram%3E%20%3C/mxfile%3E#%7B%22pageId%22%3A%22h8417y_2Co3IN_Bi5ury%22%7D'
        return url