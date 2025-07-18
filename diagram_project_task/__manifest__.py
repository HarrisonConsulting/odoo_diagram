# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Project Task',
    'version': '18.0.1.1.0',
    'summary': 'Add dedicated diagram field to project tasks with portal support.',
    'author': 'Harrison Consulting, LLC',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
Draw.io Diagrams for Project Task
==================================

This module adds a dedicated diagram field to project tasks, separate from the 
description field, with full portal support.

Features:
---------
* Dedicated "Diagrams" tab in project task form view
* Diagram versioning with history tracking
* Portal view enhancements:
  - Tab-based interface (Description/Diagrams/Attachments)
  - Full-screen modal for better diagram viewing
  - Automatic permission handling for portal users
  - Portal-optimized layout and styling

Technical Details:
------------------
* Adds 'diagram' field to project.task model
* Integrates with base_draw_io for diagram editing
* Portal users can view/edit based on project collaboration rights
* Automatic diagram versioning on save
    """,
    'category': 'Services/Project',
    'depends': ['project', 'base_draw_io', 'website'],
    'data': [
        "security/res_groups.xml",
        "views/project_task_views.xml",
        "views/project_task_portal_templates.xml",
    ],
    'assets': {
        'web.assets_frontend': [
            'diagram_project_task/static/src/scss/diagram_editor.scss',
            'diagram_project_task/static/src/js/PortalTask.js',
            'diagram_project_task/static/src/js/portal_diagram_viewer.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}