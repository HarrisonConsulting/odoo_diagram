# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Portal Users',
    'version': '17.0.1.0.0',
    'summary': """This module helps to view and edit project task diagrams
     through the website portal.""",
    'author': 'Harrison Consulting',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
    """,
    'category': 'Website',
    'depends': ['diagram_project_task','website'],
    'data': [
        "security/res_groups.xml",
        "views/project_task_portal_templates.xml",
    ],
    'assets': {
        'web.assets_frontend': [
            'diagram_website_portal/static/src/scss/diagram_editor.scss',
            'diagram_website_portal/static/src/xml/DrawDiagramBinary_templates.xml',
            'diagram_website_portal/static/src/js/DrawDiagramPortal.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
