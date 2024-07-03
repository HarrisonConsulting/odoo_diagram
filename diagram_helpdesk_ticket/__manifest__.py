# -*- coding: utf-8 -*-
{
    'name': 'Draw.io Diagrams for Helpdesk Ticket',
    'version': '17.0.1.0.1',
    'summary': 'This moodule adds a tab to Helpdesk Tickets form to draw diagrams.',
    'author': 'Harrison Consulting',
    'website': 'https://www.harrison.consulting',
    'sequence': 0,
    'license': 'GPL-3',
    'description': """
    """,
    'category': 'Services/Project',
    'depends': ['helpdesk', 'base_draw_io'],
    'data': [
        "views/helpdesk_ticket_views.xml",
    ],
    'installable': True,
    'application': False,
    'auto_install': False,
}