# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class DiagramVersion(models.Model):
    _inherit = "diagram.version"
    
    ticket_id = fields.Many2one('helpdesk.ticket')

    @api.model
    def create(self, vals):
        new_record = super(DiagramVersion, self).create(vals)
        ticket_id = vals.get('ticket_id') or new_record.ticket_id.id
        # Get all records with the same ticket_id, ordered by creation date
        # (or any field to define "latest")
        existing_records = self.search([('ticket_id', '=', ticket_id)],
                                       order='create_date desc')
        limit = int(self.env['ir.config_parameter'].sudo().get_param('base_draw_io.diagram_history_records_count'))
        # If there are more than 13 records, delete the older ones
        if len(existing_records) > limit:
            records_to_delete = existing_records[limit:]  # All records after the 13th latest
            records_to_delete.sudo().unlink()
        return new_record
