# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Knowledge Module',
    'version': '17.0.1.0.0',
    'summary': """This moodule adds a diagram in '/' menu in knowledge to draw diagrams.""",
    'author': 'Harrison Consulting',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
    """,
    'category': 'Services/Project',
    'depends': ['knowledge', 'base_draw_io'],
    'data': [
        "views/knowledge_article_views.xml",
    ],
    'assets': {
    'web.assets_backend': [
        'diagram_knowledge_article/static/src/js/diagram_behavior.js',
        'diagram_knowledge_article/static/src/js/html_field.js',
        'diagram_knowledge_article/static/src/xml/diagram_behavior_template.xml',
    ],
    'knowledge.assets_wysiwyg': [
            'diagram_knowledge_article/static/src/js/wysiwyg.js',
            'diagram_knowledge_article/static/src/xml/knowledge_editor.xml',
        ]
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}
