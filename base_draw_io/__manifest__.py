# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams Base Module',
    'version': '18.0.1.2.2',
    'summary': 'Draw.io diagram widget and version control infrastructure',
    'author': 'Harrison Consulting, LLC',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
Draw.io Diagrams Base Module
============================

This module provides the base infrastructure for Draw.io diagram integration in Odoo.

Features:
---------
* Draw.io diagram widget for field-based diagram editing
* Diagram version control and history management
* Portal-aware permissions for secure diagram viewing
* Settings for version history configuration

This module is used by other modules like diagram_helpdesk_ticket and 
diagram_project_task to add diagram functionality to specific models.

For HTML editor integration with /diagram command, install the 'diagram' module.
    """,
    'category': 'Services/Project',
    'depends': ['web', 'html_editor'],
    'data': [
        "security/ir.model.access.csv",
        "views/diagram_version_view.xml",
        "views/res_config_settings_views.xml",
    ],
    'assets':{
        'web.assets_backend':[
            'base_draw_io/static/src/xml/draw_diagram_widget.xml',
            'base_draw_io/static/src/js/draw_diagram_widget.js',
            'base_draw_io/static/src/scss/diagram_styles.scss',
        ],
        'web.assets_frontend':[
            'base_draw_io/static/src/js/embedded_diagram_portal_aware.js',
            'base_draw_io/static/src/js/embedded_diagram_portal_simple.js',
            'base_draw_io/static/src/js/portal_diagram_loader.js',
            'base_draw_io/static/src/scss/diagram_styles.scss',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}