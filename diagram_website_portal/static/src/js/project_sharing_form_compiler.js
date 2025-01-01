/** @odoo-module */

import { append, createElement, setAttributes } from "@web/core/utils/xml";
import { registry } from "@web/core/registry";
import { SIZES } from "@web/core/ui/ui_service";
//import { getModifier, ViewCompiler } from "@web/views/view_compiler";
import { patch } from "@web/core/utils/patch";
import { FormCompiler } from "@web/views/form/form_compiler";

patch(FormCompiler.prototype, {
    compile(node, params) {
        const res = super.compile(node, params);
        const ContainerHookXml = res.querySelector('#diagram_0');
        if (!ContainerHookXml) {
            return res;
        }
        const formSheetBgXml = res.querySelector('.o_form_sheet_bg');
        const parentXml = formSheetBgXml && formSheetBgXml.parentNode;
        console.log('parentXmlparentXml',parentXml)
        if (!parentXml) {
            return res;
        }
        // after sheet bg (standard position, below form)
        setAttributes(ContainerHookXml, {
//            't-att-class': `{
//            }`,
        });
//        append(parentXml, ContainerHookXml);
        return res;
    }
});
