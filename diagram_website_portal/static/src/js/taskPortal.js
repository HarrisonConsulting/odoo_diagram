/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { session } from "@web/session";

publicWidget.registry.projectTaskDiagram = publicWidget.Widget.extend({
    selector: '#task_content',
    events: {
        'click #create_diagram': '_handleCreateDiagram',
    },
     init() {
        this._super(...arguments);
        this.orm = this.bindService("orm");
    },
    async start() {
            return this._super(...arguments);
        },

    /**
     * Toggles the visibility of the diagram div when the button is clicked.
     * @private
     * @return {void}
     */
    _handleCreateDiagram(ev) {
        let modal = document.querySelector("#task_diagram_io");
        // Toggle the display property based on current visibility
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        } else {
            modal.style.display = 'block';
        }
    },
});
