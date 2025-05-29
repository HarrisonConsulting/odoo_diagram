import { Component } from "@odoo/owl";
import { KNOWLEDGE_PUBLIC_EMBEDDINGS } from "@website_knowledge/frontend/editor/embedded_components/embedding_sets";
const { onMounted, useRef } = owl;
import { rpc } from "@web/core/network/rpc";

export class EmbeddedDiagramComponentRead extends Component {
    static template = "diagram_knowledge_article.EmbeddedDiagram";
    static props = {};
    setup() {
        super.setup();
        this.url = "https://embed.diagrams.net/?proto=json&spin=1&ui=min&libraries=1&fit=1&saveAndExit=0&noExitBtn=1"
        this.frameRef = useRef('diagramEditor');
        onMounted(async () => {
            this.diagram =  await rpc("/fetch_diagram", {
                resId: this.__owl__.app.props.resId,
            });
            this.frame = this.frameRef.el;
            await this.loadIframe();
        });
    }
    async loadIframe(){
            this.frame.src = '';
            await new Promise(resolve => setTimeout(resolve, 2000));
            var text = encodeURIComponent(this.diagram);
            this.frame.src = `https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&pageScale=1&layers=1&nav=1&title=#R${text}`;
    }
}
export const diagramEmbeddingRead = {
    name: "DiagramContent",
    Component: EmbeddedDiagramComponentRead,
};
KNOWLEDGE_PUBLIC_EMBEDDINGS.push(diagramEmbeddingRead);
