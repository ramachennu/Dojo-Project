
define([
    "dojo/_base/declare",
    "./Support",
    './Tooltip',
    "dojo/query",
    "dojo/_base/lang",
    'dojo/on',
    'dojo/dom-class',
    'dojo/dom-construct',
    "dojo/dom-attr",
    'dojo/html',
    "dojo/NodeList-dom",
    "dojo/NodeList-manipulate",
    "dojo/domReady!"
], function (declare, support, Tooltip, query, lang, on, domClass, domConstruct, domAttr, html) {
    "use strict";

    var Popover = declare(Tooltip, {
        "-chains-":{ constructor:"manual" },
        constructor:function (element, options) {
            options = lang.mixin({
                placement:'right',
                trigger: 'click',
                content:'',
                template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"></div></div></div>'
            }, (options || {}));
            this.init('popover', element, options);
        },
        setContent:function () {
            var tip = this.tip();
            var title = this.getTitle();
            var content = this.getContent();
            query('.popover-title', tip)[this.options.html ? 'html' : 'text'](title);
            query('.popover-content', tip)[this.options.html ? 'html' : 'text'](content);
            domClass.remove(tip, 'fade in top bottom left right');
        },
        hasContent:function () {
            return this.getTitle() || this.getContent();
        },
        getContent:function () {
            return domAttr.get(this.domNode, 'data-content') || (typeof this.options.content === 'function' ? this.options.content.call(this.domNode) : this.options.content);
        },
        tip:function () {
            return this.tipNode = (this.tipNode) ? this.tipNode : domConstruct.toDom(this.options.template);
        },
        arrow:function () {
            this.arrowNode = this.arrowNode ? this.arrowNode : query('.arrow', this.tip())[0];
            return this.arrowNode;
        },
        destroy: function() {
            this.hide();
            if (this.eventActivate) { this.eventActivate.remove(); }
            if (this.eventDeactivate) { this.eventDeactivate.remove(); }
            support.removeData(this.domNode, 'bs.popover');
        }
    });

    lang.extend(query.NodeList, {
        popover:function (option) {
            var options = (lang.isObject(option)) ? option : {};
            return this.forEach(function (node) {
                var data = support.getData(node, 'bs.popover');
                if (!data) {
                    support.setData(node, 'bs.popover', (data = new Popover(node, options)));
                }
                if (lang.isString(option)) {
                    data[option].call(data);
                }
            });
        }
    });
    return Popover;
});