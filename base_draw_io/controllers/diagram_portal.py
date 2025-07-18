# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import json


class DiagramPortalController(http.Controller):
    """
    Generic controller for handling diagram permissions across different models
    in portal contexts. This allows any model with diagrams to properly handle
    view/edit permissions for portal users.
    """
    
    @http.route('/diagram/check_edit_permission', type='json', auth='public', methods=['POST'])
    def check_edit_permission(self, model, res_id, **kwargs):
        """
        Check if the current user can edit a diagram on a specific record.
        
        This method handles various scenarios:
        - Internal users: Check standard ACL permissions
        - Portal users: Check model-specific rules (collaborators, followers, etc.)
        - Public users: Always read-only
        """
        user = request.env.user
        
        # Public users can never edit
        if user._is_public():
            return False
            
        # Internal users - check standard permissions
        if user.has_group('base.group_user'):
            try:
                record = request.env[model].browse(res_id)
                record.check_access_rights('write')
                record.check_access_rule('write')
                return True
            except:
                return False
        
        # Portal users - check model-specific permissions
        if user.has_group('base.group_portal'):
            return self._check_portal_edit_permission(model, res_id, user)
            
        return False
    
    def _check_portal_edit_permission(self, model, res_id, user):
        """
        Check model-specific permissions for portal users.
        Can be extended by other modules to add model-specific rules.
        """
        try:
            record = request.env[model].sudo().browse(res_id)
            
            # Project Task specific rules
            if model == 'project.task':
                project = record.project_id
                # Check if user is a project collaborator
                if project and user.partner_id in project.collaborator_ids.partner_id:
                    return True
                # Check if user is assigned to the task
                if user.partner_id in record.user_ids.partner_id:
                    return True
                    
            # Helpdesk Ticket specific rules
            elif model == 'helpdesk.ticket':
                # Check if user is the ticket partner
                if record.partner_id == user.partner_id:
                    # Additional check: only if ticket is not closed
                    if record.stage_id and not record.stage_id.is_close:
                        return True
                        
            # Sale Order specific rules
            elif model == 'sale.order':
                # Check if user is the customer
                if record.partner_id == user.partner_id:
                    # Only in draft or sent states
                    if record.state in ['draft', 'sent']:
                        return True
                        
            # Add more model-specific rules as needed
            
        except:
            # Any error means no access
            pass
            
        return False
    
    @http.route('/diagram/save', type='json', auth='public', methods=['POST'])
    def save_diagram(self, model, res_id, diagram_data, **kwargs):
        """
        Save diagram data with permission checking.
        """
        # First check if user can edit
        can_edit = self.check_edit_permission(model, res_id)
        if not can_edit:
            return {'error': 'Permission denied'}
            
        try:
            record = request.env[model].browse(res_id)
            
            # Check if model has diagram field
            if 'diagram' not in record._fields:
                return {'error': 'Model does not support diagrams'}
                
            # Save the diagram
            record.sudo().write({'diagram': diagram_data})
            
            # If model has diagram versioning, create a version
            if 'diagram_version_id' in record._fields:
                version = request.env['diagram.version'].sudo().create({
                    'content': diagram_data,
                })
                record.sudo().write({'diagram_version_id': version.id})
                
            return {'success': True}
            
        except Exception as e:
            return {'error': str(e)}