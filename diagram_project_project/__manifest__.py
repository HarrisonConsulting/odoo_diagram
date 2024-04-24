# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Project',
    'version': '17.0.1.0.0',
    'summary': '''
    This moodule adds a tab to the project model form to draw diagrams. 
    These diagrams would be context specific to the project and its tasks.
    ''',
    'author': 'Harrison Consulting',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
    """,
    'category': 'Services/Project',
    'depends': ['project', 'base_draw_io'],
    'data': [
        "views/project_project_views.xml",
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}