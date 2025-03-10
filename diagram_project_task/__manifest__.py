# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Project Task',
    'version': '17.0.1.0.1',
    'summary': 'This moodule adds a tab to the project task form to draw diagrams.',
    'author': 'Harrison Consulting',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
    """,
    'category': 'Services/Project',
    'depends': ['project', 'base_draw_io'],
    'data': [
        "views/project_task_views.xml",
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}