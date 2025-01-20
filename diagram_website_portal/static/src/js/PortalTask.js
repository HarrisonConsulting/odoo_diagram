/** @odoo-module **/

import publicWidget from "@web/legacy/js/public/public_widget";
import { session } from "@web/session";

publicWidget.registry.TaskDiagram = publicWidget.Widget.extend({
    selector: '#card_body',
    events: {
        'click #Show_full_screen': '_handleShowFullScreen',
        'click .close_modal': '_handleCloseModal',
    },
    async start() {
            return this._super(...arguments);
        },
        /**
         * Opens the modal the
         * @private
         * @return {void}
         */
         _handleShowFullScreen(ev) {
            let modal = document.querySelector(".fullscreen_diagram")
            modal.style.display='block';
        },
         /**
         * Close the modal
         * @private
         * @return {void}
         */
        _handleCloseModal(ev){
            let modal = document.querySelector(".fullscreen_diagram")
            if(modal){
            modal.style.display='none'; }
            location.reload();
        },
});
