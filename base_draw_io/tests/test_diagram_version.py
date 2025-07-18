# -*- coding: utf-8 -*-
from odoo.tests import TransactionCase, tagged


@tagged('post_install', '-at_install')
class TestDiagramVersion(TransactionCase):
    """Test diagram version control functionality"""
    
    def test_diagram_version_creation(self):
        """Verify that diagram versions can be created and managed"""
        # This is a basic test to ensure the module loads without errors
        # The actual widget functionality would be tested through browser tests
        
        # Test that we can access the diagram.version model
        DiagramVersion = self.env['diagram.version']
        self.assertTrue(hasattr(DiagramVersion, 'create'), "diagram.version model should be accessible")
        
        # Test that we can create a diagram version record
        version = DiagramVersion.create({
            'diagram_xml': '<mxGraphModel><root></root></mxGraphModel>',
        })
        self.assertTrue(version.id, "Should be able to create diagram version")
        self.assertEqual(version.diagram_xml, '<mxGraphModel><root></root></mxGraphModel>')