# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams Base Module',
    'version': '17.0.1.0.0',
    'summary': 'This base module embeded Draw.io Tool',
    'author': 'Harrison Consulting',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
    """,
    'category': 'Services/Project',
    'depends': [],
    'data': [
        "security/ir.model.access.csv",
        "views/diagram_version_view.xml",
    ],
    'assets':{
        'web.assets_backend':[
            'base_draw_io/static/src/xml/*',
            'base_draw_io/static/src/js/draw_diagram_widget.js',
            'base_draw_io/static/src/scss/*',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}