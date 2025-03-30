# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class DiagramVersion(models.Model):
    _name = "diagram.version"
    _description = "Stores Diagram xml data"
    _order = "is_pinned DESC, create_date DESC"
    _rec_name = "name"

    name = fields.Char(string="Version Name", 
                      help="Name of this diagram version for identification purposes.")
    diagram_xml = fields.Text(string="Diagram XML", 
                             help="XML content of the diagram in draw.io format.")
    reference_model = fields.Char(string="Referenced Model", 
                                 help="Technical name of the model this diagram belongs to.")
    reference_id = fields.Integer(string="Referenced Record ID", 
                                 help="ID of the record this diagram is related to.")
    is_pinned = fields.Boolean(string="Pinned", default=False,
                              help="Pinned versions won't be automatically deleted when the version limit is reached.")
    
    @api.model_create_multi
    def create(self, vals_list):
        records = super(DiagramVersion, self).create(vals_list)
        
        # Group new records by reference model and ID for efficient processing
        references = {}
        for record in records:
            if record.reference_model and record.reference_id:
                key = (record.reference_model, record.reference_id)
                if key not in references:
                    references[key] = []
                references[key].append(record.id)
        
        # Apply versioning limits for each reference
        limit = int(self.env['ir.config_parameter'].sudo().get_param(
            'base_draw_io.diagram_history_records_count', '13'))
            
        for (model, ref_id), record_ids in references.items():
            # Get all unpinned records for this reference
            existing_records = self.search([
                ('reference_model', '=', model),
                ('reference_id', '=', ref_id),
                ('is_pinned', '=', False)
            ], order='create_date desc')
            
            if len(existing_records) > limit:
                records_to_delete = existing_records[limit:]
                records_to_delete.sudo().unlink()
        
        return records

    def get_reference(self):
        """Get the referenced record for this diagram version."""
        self.ensure_one()
        if self.reference_model and self.reference_id:
            return self.env[self.reference_model].browse(self.reference_id)
        return False
        
    def toggle_pin(self):
        """Toggle the pinned status of the version."""
        for record in self:
            record.is_pinned = not record.is_pinned
        return True