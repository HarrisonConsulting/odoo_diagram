# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Knowledge Module',
    'version': '18.0.1.0.3',
    'summary': """This module adds a diagram in '/' menu in knowledge to draw diagrams.""",
    'author': 'Harrison Consulting',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """ """,
    'category': 'Services/Project',
    'depends': ['knowledge', 'base_draw_io','website_knowledge'],
    'data': [
        "views/knowledge_article_views.xml",
    ],
    'assets': {
    'web.assets_backend': [
        'diagram_knowledge_article/static/src/js/embedded_diagram_component.js',
        'diagram_knowledge_article/static/src/js/article_diagram_plugin.js',
        'diagram_knowledge_article/static/src/xml/article_diagram_blueprint.xml',
        'diagram_knowledge_article/static/src/xml/embedded_diagram_component.xml',
        ],
    'web.assets_frontend': [
        'diagram_knowledge_article/static/src/css/public_diagram_view.scss',
        'diagram_knowledge_article/static/src/js/public_diagram_component.js',
        'diagram_knowledge_article/static/src/xml/embedded_diagram_component.xml',
    ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
