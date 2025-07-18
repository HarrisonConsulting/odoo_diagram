# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Helpdesk Ticket',
    'version': '18.0.1.0.4',
    'summary': 'This moduleadds a tab to Helpdesk Tickets form to draw diagrams.',
    'author': 'Harrison Consulting, LLC',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
    """,
    'category': 'Services/Project',
    'depends': ['helpdesk', 'base_draw_io', 'website'],
    'data': [
        "views/helpdesk_ticket_views.xml",
        "views/helpdesk_ticket_portal_templates.xml",
    ],
    'assets': {
        'web.assets_frontend': [
            'diagram_helpdesk_ticket/static/src/scss/ticket_diagram_portal.scss',
            'diagram_helpdesk_ticket/static/src/js/portal_ticket_diagram.js',
        ],
    },
    'installable': True,
    'application': False,
    'auto_install': False,
}