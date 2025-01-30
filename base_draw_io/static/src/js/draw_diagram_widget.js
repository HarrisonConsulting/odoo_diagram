/** @odoo-module **/

import { registry } from "@web/core/registry";
import { CharField, charField } from "@web/views/fields/char/char_field";
const { Component, onMounted, useRef, useExternalListener } = owl;
import { jsonrpc } from "@web/core/network/rpc_service";
import { EventBus } from "@odoo/owl";


export class DrawDiagramBinary extends CharField {
    setup() {
        super.setup();
        this.frameRef = useRef('diagramEditor');
        this.handleMessageEvent = this._handleMessageEvent.bind(this);
        onMounted(() => {
            this.frame = this.frameRef.el;
            this.startEditing();
        });
        useExternalListener(window, "click", this.onWindowClick, true);
    }

    onWindowClick(ev){
        if($(ev.target).parent().hasClass('load-diagram-version')){
            this.initializeEditor()
        }
    }

    get url() {
        var url = "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&fit=1&saveAndExit=0&noExitBtn=1"
        return url;
    }

    postMessage (msg) {
        if (this.frame != null) {
            this.frame.contentWindow.postMessage(JSON.stringify(msg), '*');
        }
    }

    async initializeEditor () {
        this.postMessage({
            action: 'load',
            xml: this.props.record.data.diagram,
            autosave: '1',
        });
    }

    configureEditor () {
        this.postMessage({
            action: 'configure',
            config: this.props.config
        });
    }
    startEditing() {
        window.addEventListener('message', this.handleMessageEvent);
    }
    _handleMessageEvent(evt) {
        if (this.frame != null && evt.source == this.frame.contentWindow &&
            evt.data.length > 0) {
            try {
                var msg = JSON.parse(evt.data);
                if (msg != null) {
                    this.handleMessage(msg);
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    async handleMessage(msg) {
        switch (msg.event) {
            case 'configure':
                this.configureEditor();
                break;
            case 'init':
                this.initializeEditor();
                break;
            case 'save':
                this.saveDiagram(msg.xml, msg.exit);
                break;
            case 'autosave':
                 await this.saveDiagram(msg.xml, msg.exit);
                 break;
            default:
                console.log(msg.event);
                break;
        }
    }

    async saveDiagram(xml, exit) {
        var self=this
        await jsonrpc(`/web/dataset/call_kw/${this.props.record._config.resModel}/write`, {
            model: this.props.record._config.resModel,
            method: "write",
            args: [
                [this.props.record._config.resId],
                {[this.props.name]: xml, 'save_diagram':true}
            ],
            kwargs:{}
        });
        self.props.record.data.diagram = xml;
    }

    fullScreenEditor(){
        var diagramElement = document.querySelector('.o_diagram');
        diagramElement.requestFullscreen()
        if (diagramElement) {
            diagramElement.style.position = 'fixed';
            diagramElement.style.width = '100%';
            diagramElement.style.height = '100%';
            this.frame.style.height = '95%';
            diagramElement.style.left = '0';
            diagramElement.style.top = '0';
            diagramElement.style.zIndex = '999';
        }
       document.querySelector('.load-diagram-full-screen-close').style.display = '';
       document.querySelector('.load-diagram-full-screen').style.display = 'none';
       this.frame.src = 'https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&fit=1&saveAndExit=0&noExitBtn=1';
    }
    fullScreenEditorClose(){
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
        var diagramElement = document.querySelector('.o_diagram');
        if (diagramElement) {
            diagramElement.style.position = '';
            diagramElement.style.width = '';
            this.frame.style.height = '';
            diagramElement.style.height = '';
            diagramElement.style.left = '';
            diagramElement.style.top = '';
            diagramElement.style.zIndex = '';
        }
        document.querySelector('.load-diagram-full-screen-close').style.display = 'none';
        document.querySelector('.load-diagram-full-screen').style.display = '';
        this.frame.src = 'https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&fit=1&saveAndExit=0&noExitBtn=1';
    }
}
DrawDiagramBinary.template = "draw_io_diagram.draw_diagram";

export const drawDiagramBinary = {
    ...charField,
    supportedTypes: ["char"],
    component: DrawDiagramBinary,
};

registry.category("fields").add("draw_diagram", drawDiagramBinary);
