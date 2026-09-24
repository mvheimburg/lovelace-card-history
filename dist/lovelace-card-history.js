/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,e$2=t$1.ShadowRoot&&(void 0===t$1.ShadyCSS||t$1.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$3=new WeakMap;let n$2 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$2&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$3.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$3.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$2("string"==typeof t?t:t+"",void 0,s$2),i$3=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$2(o,t,s$2)},S$1=(s,o)=>{if(e$2)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$1.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$2?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$2,defineProperty:e$1,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$2,getPrototypeOf:n$1}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$2(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$1(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$1(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$2(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,i$1=t=>t,s$1=t.trustedTypes,e=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$1=`lit$${Math.random().toFixed(9).slice(2)}$`,n="?"+o$1,r=`<${n}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),w=x(2),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e?e.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$1+x):s+o$1+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$1),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$1)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$1),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$1,t+1));)d.push({type:7,index:l}),t+=o$1.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$1(t).nextSibling;i$1(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t.litHtmlPolyfillSupport;B?.(S,k),(t.litHtmlVersions??=[]).push("3.3.3");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}}i._$litElement$=true,i["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i});const o=s.litElementPolyfillSupport;o?.({LitElement:i});(s.litElementVersions??=[]).push("4.2.2");

/**
 * The state of one history view: its range, what it loaded for which window,
 * the time under the pointer, loading and failure, and the plot's width.
 *
 * A reply that arrives after the range changed, the view was reset or the host
 * left the page is dropped, so a slow request never overwrites a newer one.
 */
class HistoryController {
    constructor(host, load, options = {}) {
        this.host = host;
        this.load = load;
        this.loading = false;
        this.error = "";
        /** The plot's width in px, following its element (see `observe`). */
        this.width = 600;
        this.ticket = 0;
        this.range = options.range ?? 24;
        host.addController(this);
    }
    hostDisconnected() {
        this.ticket++;
        this.loading = false;
        this.resize?.disconnect();
        this.resize = this.observed = undefined;
    }
    /** Load `range` (the current one by default). The failure text is prefixed with `failed`. */
    async reload(range = this.range, failed = "") {
        const ticket = ++this.ticket;
        this.range = range;
        this.loading = true;
        this.error = "";
        this.hover = undefined;
        this.host.requestUpdate();
        const end = Date.now();
        try {
            const data = await this.load(range, end);
            if (ticket !== this.ticket)
                return;
            this.data = data;
            this.window = [end - range * 3600000, end];
        }
        catch (error) {
            if (ticket !== this.ticket)
                return;
            this.data = this.window = undefined;
            const message = error instanceof Error
                ? error.message
                : typeof error === "object" && error && "message" in error
                    ? String(error.message)
                    : String(error);
            this.error = failed ? `${failed}: ${message}` : message;
        }
        this.loading = false;
        this.host.requestUpdate();
    }
    /** Forget what was loaded and ignore replies still on their way. */
    reset() {
        this.ticket++;
        this.data = this.window = this.hover = undefined;
        this.loading = false;
        this.error = "";
        this.host.requestUpdate();
    }
    /** Stop listening for a reply without forgetting what is shown (a closed dialog). */
    cancel() {
        this.ticket++;
        this.loading = false;
        this.hover = undefined;
    }
    setHover(time) {
        if (time === this.hover)
            return;
        this.hover = time;
        this.host.requestUpdate();
    }
    /** Follow an element's width, so the chart is drawn at its real size. */
    observe(element) {
        if (!element || element === this.observed)
            return;
        this.resize?.disconnect();
        this.observed = element;
        this.resize = new ResizeObserver(([entry]) => {
            const width = Math.round(entry.contentRect.width);
            // Redraw next frame, outside the observer's own layout pass.
            if (width > 0 && Math.abs(width - this.width) > 4)
                requestAnimationFrame(() => {
                    this.width = width;
                    this.host.requestUpdate();
                });
        });
        this.resize.observe(element);
    }
}

/** Loading recorder history for charts and timelines. */
/**
 * A connection for history requests: `hass.callWS` when Home Assistant offers
 * it, else its websocket connection.
 */
function historyConnection(hass) {
    return {
        sendMessagePromise: (message) => {
            if (hass.callWS)
                return hass.callWS(message);
            if (hass.connection)
                return hass.connection.sendMessagePromise(message);
            return Promise.reject(new Error("No connection to Home Assistant"));
        },
    };
}
/** The ranges every history view offers, in hours. */
const RANGES = [6, 24, 168];
const SILENT = new Set(["unavailable", "unknown", ""]);
/** A reading as a number; `undefined` while unavailable or not a number. */
function numeric(state) {
    if (state === undefined || SILENT.has(state))
        return undefined;
    const value = Number(state);
    return Number.isFinite(value) ? value : undefined;
}
/** States that mean on/open for a lane; anything else reported means off. */
const ON = ["on", "open", "opening", "ajar", "unlocked", "true"];
/** 1 while on/open, 0 while off, `undefined` while unreported. */
function onOff(state) {
    if (state === undefined || SILENT.has(state))
        return undefined;
    return ON.includes(state.toLowerCase()) ? 1 : 0;
}
const isTemperature = (unit) => ["°C", "°F", "K"].includes(unit);
/** The unit of an entity's readings. */
const unitOf = (state) => String(state?.attributes.unit_of_measurement ?? "");
/**
 * Whether a reading is worth a history line: a numeric sensor measurement, not a
 * timestamp, duration, enum, text or a controllable setting.
 */
function isMeasurement(state) {
    if (!state)
        return false;
    const a = state.attributes;
    if (["duration", "timestamp", "date", "enum"].includes(String(a.device_class)))
        return false;
    if (!a.unit_of_measurement && !a.state_class)
        return false;
    return SILENT.has(state.state) || numeric(state.state) !== undefined;
}
/**
 * Raw history of `ids` since `start`, one request. With `attributes`, each row
 * carries its attributes (needed to read one), which costs a larger reply.
 */
async function rawRows(connection, ids, start, attributes = false) {
    if (!ids.length)
        return {};
    return ((await connection.sendMessagePromise({
        type: "history/history_during_period",
        start_time: new Date(start).toISOString(),
        entity_ids: ids,
        minimal_response: !attributes,
        no_attributes: !attributes,
        significant_changes_only: false,
    })) ?? {});
}
/** Raw state history of `ids` since `start`, as marks. */
async function rawHistory(connection, ids, start) {
    const reply = await rawRows(connection, ids, start);
    return Object.fromEntries(ids.map((id) => [
        id,
        (reply?.[id] ?? []).map((row) => [
            Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
            row.s,
        ]),
    ]));
}
/**
 * Hourly means of `ids` since `start`. An hour without a statistic is a gap: the
 * mark after the last row of a run says the sensor went quiet.
 */
async function hourlyMeans(connection, ids, start, end) {
    if (!ids.length)
        return {};
    const reply = await connection.sendMessagePromise({
        type: "recorder/statistics_during_period",
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        statistic_ids: ids,
        period: "hour",
        types: ["mean", "state"],
    });
    const HOUR = 3600000;
    return Object.fromEntries(ids.map((id) => {
        const marks = [];
        let last;
        for (const row of reply?.[id] ?? []) {
            const t = typeof row.start === "number" ? row.start : Date.parse(row.start);
            const value = row.mean ?? row.state;
            if (!Number.isFinite(t) || value === null || value === undefined)
                continue;
            if (last !== undefined && t - last > HOUR * 1.5)
                marks.push([last + HOUR, undefined]);
            marks.push([Math.max(start, t), String(value)]);
            last = t;
        }
        return [id, marks];
    }));
}
/**
 * The history of each source over the last `hours`, ending with the entity's
 * current state. Lanes are loaded as on/off, lines and steps as numbers.
 */
async function loadSeries(connection, sources, states, hours, options = {}) {
    const now = options.now ?? Date.now();
    const start = now - hours * 3600000;
    const statisticsFrom = options.statisticsFrom ?? 168;
    const ids = [
        ...new Set(sources.filter((s) => !s.attribute).map((s) => s.entityId)),
    ];
    const withAttributes = [
        ...new Set(sources.filter((s) => s.attribute).map((s) => s.entityId)),
    ];
    const fromStatistics = new Set(statisticsFrom > 0 && hours >= statisticsFrom
        ? sources
            .filter((s) => s.kind !== "lane" &&
            s.kind !== "step" &&
            !s.attribute &&
            states[s.entityId]?.attributes.state_class)
            .map((s) => s.entityId)
        : []);
    const [raw, means, full] = await Promise.all([
        rawHistory(connection, ids.filter((id) => !fromStatistics.has(id)), start),
        hourlyMeans(connection, [...fromStatistics], start, now),
        rawRows(connection, withAttributes, start, true),
    ]);
    return sources.map((source) => {
        const current = states[source.entityId];
        const read = (state, a) => source.attribute
            ? SILENT.has(state ?? "") || a?.[source.attribute] == null
                ? undefined
                : String(a[source.attribute])
            : state;
        // Full rows repeat the last attributes: a row may omit unchanged ones.
        let attrs;
        const marks = source.attribute
            ? (full[source.entityId] ?? []).map((row) => {
                attrs = row.a ?? attrs;
                return [
                    Math.max(start, (row.lu ?? row.lc ?? 0) * 1000),
                    read(row.s, attrs),
                ];
            })
            : [...(raw[source.entityId] ?? means[source.entityId] ?? [])];
        if (current)
            marks.push([now, read(current.state, current.attributes)]);
        const lane = source.kind === "lane";
        return {
            ...source,
            unit: source.unit ?? (lane ? "" : unitOf(current)),
            points: marks.map(([t, s]) => [t, lane ? onOff(s) : numeric(s)]),
            states: marks.map(([t, s]) => [
                t,
                s === undefined || SILENT.has(s) ? undefined : s,
            ]),
        };
    });
}
/** The state history of each entity as timeline lanes, ending with its current state. */
async function loadLanes(connection, lanes, states, hours, options = {}) {
    const now = options.now ?? Date.now();
    const start = now - hours * 3600000;
    const raw = await rawHistory(connection, [...new Set(lanes.map((l) => l.entityId))], start);
    return lanes.map((lane) => {
        const marks = [...(raw[lane.entityId] ?? [])];
        const current = states[lane.entityId];
        if (current)
            marks.push([now, current.state]);
        // A silent spell is a gap, whatever the entity called it.
        return {
            ...lane,
            marks: marks.map(([t, s]) => [
                t,
                s === undefined || SILENT.has(s) ? undefined : s,
            ]),
        };
    });
}
/** The value in force at `time`: the last point at or before it. */
function valueAt(series, time) {
    let value;
    for (const [t, v] of series.points) {
        if (t > time)
            break;
        value = v;
    }
    return value;
}
/** The state in force at `time` in a series or lane. */
function stateAt(item, time) {
    let value;
    for (const [t, v] of item.states ?? item.marks ?? []) {
        if (t > time)
            break;
        value = v;
    }
    return value;
}

/** The history view's own words, in English and Norwegian Bokmål. */
/** `nb` for Bokmål and its aliases (`nb-NO`, legacy `no`, `nn` → Bokmål), else `en`. */
function historyLanguage(hass) {
    const code = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .split("-")[0];
    return ["nb", "no", "nn"].includes(code) ? "nb" : "en";
}
/**
 * The locale for dates and numbers, kept apart from the dictionary: `en-GB`
 * keeps its 24-hour clock, and Norwegian aliases format as Bokmål.
 */
function historyLocale(hass) {
    const code = (hass?.language || hass?.locale?.language || "en")
        .toLowerCase()
        .replace(/_/g, "-")
        .replace(/^(no|nn)(?=-|$)/, "nb");
    try {
        return Intl.getCanonicalLocales(code)[0] || "en";
    }
    catch {
        return "en";
    }
}
const en$1 = {
    history: "History",
    inspect: "Inspect time",
    showHistory: "Show history",
    closeHistory: "Close history",
    ranges: "History ranges",
    loading: "Loading history…",
    empty: "No history for this period.",
    failed: "Could not load history",
    retry: "Try again",
    now: "Now",
    unavailable: "Unavailable",
    on: "On",
    off: "Off",
    target: "target",
    mode: "History view",
    modeCard: "In the card",
    modeMoreInfo: "Home Assistant's details",
    modePanel: "Home Assistant's History page",
};
const nb$1 = {
    history: "Historikk",
    inspect: "Undersøk tidspunkt",
    showHistory: "Vis historikk",
    closeHistory: "Lukk historikk",
    ranges: "Tidsrom",
    loading: "Henter historikk …",
    empty: "Ingen historikk for denne perioden.",
    failed: "Kunne ikke hente historikk",
    retry: "Prøv igjen",
    now: "Nå",
    unavailable: "Utilgjengelig",
    on: "På",
    off: "Av",
    target: "ønsket",
    mode: "Historikkvisning",
    modeCard: "I kortet",
    modeMoreInfo: "Home Assistants detaljer",
    modePanel: "Home Assistants historikkside",
};
function historyStrings(hass) {
    return historyLanguage(hass) === "nb" ? nb$1 : en$1;
}

/** Locale formatting for charts, following HA's language and 12/24-hour setting. */
function historyFormat(hass) {
    const locale = historyLocale(hass);
    const format = hass?.locale?.time_format;
    const hour12 = format === "12" ? true : format === "24" ? false : undefined;
    const safe = (make, fallback) => {
        try {
            return make();
        }
        catch {
            return fallback;
        }
    };
    return {
        locale,
        /** A clock time, or a weekday and date on a multi-day axis. */
        time: (ms, withDay = false) => safe(() => new Intl.DateTimeFormat(locale, withDay
            ? { weekday: "short", day: "numeric" }
            : { hour: "2-digit", minute: "2-digit", hour12 }).format(ms), new Date(ms).toLocaleTimeString()),
        /** Day and time, for the readout above the legend on a multi-day range. */
        moment: (ms) => safe(() => new Intl.DateTimeFormat(locale, {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            hour12,
        }).format(ms), new Date(ms).toLocaleString()),
        /** A fixed number of decimals, for axis ticks. */
        number: (value, digits) => safe(() => new Intl.NumberFormat(locale, {
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        }).format(value), value.toFixed(digits)),
        /** A reading: up to `digits` decimals, and its unit. */
        reading: (value, unit = "", digits = 1) => `${safe(() => new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(value), String(value))}${unit ? ` ${unit}` : ""}`,
        /** A range button's label: "6 h", "24 t", "7 d". */
        span: (hours) => safe(() => new Intl.NumberFormat(locale, {
            style: "unit",
            unit: hours < 48 ? "hour" : "day",
            unitDisplay: "short",
        }).format(hours < 48 ? hours : hours / 24), hours < 48 ? `${hours} h` : `${hours / 24} d`),
    };
}

/** Round-number ticks covering [min, max], about `count` of them. */
function ticks(min, max, count = 4) {
    const raw = (max - min) / count || 1;
    const power = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * power).find((s) => s >= raw) ??
        10 * power;
    const out = [];
    // From the step at or below min up to the first step at or above max.
    for (let v = Math.floor(min / step) * step;; v += step) {
        out.push(Number(v.toFixed(6)));
        if (v >= max - 1e-9)
            break;
    }
    return out;
}

const LEFT = 44;
const TOP$1 = 24;
const PLOT_BOTTOM = 196;
/** Room right of the plot for each additional scale. */
const GUTTER = 44;
/** One lane below the plot, and the gap above the first. */
const LANE = 14;
const LANE_GAP = 6;
/** The left and right units of a chart; lanes have no scale. */
function units(all, leftUnit) {
    const series = all.filter((s) => s.kind !== "lane");
    const left = leftUnit ??
        series.find((s) => isTemperature(s.unit))?.unit ??
        series[0]?.unit ??
        "";
    return [left, series.find((s) => s.unit !== left)?.unit];
}
/** Units rendered, in axis order. Pass the length to lineChartTimeAt. */
function chartUnits(all, leftUnit, maxUnits = 2) {
    const [left] = units(all, leftUnit);
    return [
        ...new Set([
            left,
            ...all.filter((s) => s.kind !== "lane").map((s) => s.unit),
        ]),
    ].slice(0, maxUnits);
}
function rightMargin(count) {
    return count <= 1 ? 12 : GUTTER * (count - 1);
}
/**
 * Unbroken spells of a series. A step holds its value until the next change, so
 * its spell runs on to the moment it became unavailable.
 */
function runs(points, hold) {
    const out = [];
    let current = [];
    for (const [t, v] of points) {
        if (v === undefined) {
            if (current.length) {
                if (hold)
                    current.push([t, current[current.length - 1][1]]);
                out.push(current);
            }
            current = [];
        }
        else
            current.push([t, v]);
    }
    if (current.length)
        out.push(current);
    return out;
}
function scale(series, pad, domain) {
    if (domain &&
        Number.isFinite(domain[0]) &&
        Number.isFinite(domain[1]) &&
        domain[1] > domain[0]) {
        const [min, max] = domain;
        return {
            min,
            max,
            marks: [min, ...ticks(min, max).filter((v) => v > min && v < max), max],
        };
    }
    const values = series.flatMap((s) => s.points.flatMap(([, v]) => (v === undefined ? [] : [v])));
    if (!values.length)
        return undefined;
    const marks = ticks(Math.min(...values) - pad, Math.max(...values) + pad);
    return { marks, min: marks[0], max: marks[marks.length - 1] };
}
/** Monotone cubic through the points: smooth, never overshooting a reading. */
function smoothPath(pts) {
    const n = pts.length;
    if (n < 3)
        return pts
            .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
            .join(" ");
    const d = [];
    for (let i = 0; i < n - 1; i++)
        d.push((pts[i + 1][1] - pts[i][1]) / (pts[i + 1][0] - pts[i][0] || 1));
    const m = [d[0]];
    for (let i = 1; i < n - 1; i++)
        m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2);
    m.push(d[n - 2]);
    let path = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < n - 1; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[i + 1], h = (x1 - x0) / 3;
        path += ` C${(x0 + h).toFixed(1)},${(y0 + m[i] * h).toFixed(1)} ${(x1 - h).toFixed(1)},${(y1 - m[i + 1] * h).toFixed(1)} ${x1.toFixed(1)},${y1.toFixed(1)}`;
    }
    return path;
}
/** Hours between x-axis ticks, fewer on a narrow chart. */
function tickEvery(hours, narrow) {
    if (hours <= 6)
        return narrow ? 2 : 1;
    if (hours <= 24)
        return narrow ? 6 : 4;
    return narrow ? 48 : 24;
}
/**
 * One chart of related readings: the left scale in the main unit, a right-hand
 * scale for a reading in another unit, dashed steps for setpoints and a lane per
 * on/off state below the plot. Unavailable spells are gaps.
 */
function lineChart(all, start, end, hover, text, options = {}) {
    const W = options.width ?? 600;
    const fill = options.fill ?? true;
    const series = all.filter((s) => s.kind !== "lane");
    const lanes = all.filter((s) => s.kind === "lane");
    // Without readings the chart is just its lanes.
    const BOTTOM = series.length ? PLOT_BOTTOM : TOP$1 - LANE_GAP;
    const END = BOTTOM + (lanes.length ? LANE_GAP + lanes.length * LANE : 0);
    const H = END + 34;
    const axisUnits = chartUnits(series, options.leftUnit, options.maxUnits);
    const RIGHT = W - rightMargin(axisUnits.length);
    const pad = (list, unit) => isTemperature(unit) ||
        list.some((s) => s.points.some(([, v]) => v !== undefined && Math.abs(v) >= 10))
        ? 1
        : 0.1;
    const axes = axisUnits.map((unit) => {
        const list = series.filter((s) => s.unit === unit);
        return {
            unit,
            list,
            scale: scale(list, pad(list, unit), options.domains?.[unit]),
        };
    });
    const x = (t) => LEFT +
        ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
            (RIGHT - LEFT);
    const y = (v, s) => BOTTOM - ((v - s.min) / (s.max - s.min || 1)) * (BOTTOM - TOP$1);
    const every = tickEvery((end - start) / 3600000, W < 480);
    const xTicks = [];
    const hour = new Date(start);
    hour.setMinutes(0, 0, 0);
    let midnights = 0;
    for (let t = hour.getTime(); t <= end; t += 3600000) {
        if (t < start)
            continue;
        const h = new Date(t).getHours();
        if (every >= 24
            ? h === 0 && midnights++ % (every / 24) === 0
            : h % every === 0)
            xTicks.push(t);
    }
    // Leave room for localized clock labels, including a 12-hour AM/PM suffix.
    let previousLabelRight = -Infinity;
    const labeledTicks = xTicks.filter((t) => {
        const half = text.time(t, every >= 24).length * 3.5;
        if (x(t) - half < previousLabelRight + 10)
            return false;
        previousLabelRight = x(t) + half;
        return true;
    });
    const paths = (s, sc) => runs(s.points, s.kind === "step").map((run) => {
        const pts = run.map(([t, v]) => [x(t), y(v, sc)]);
        const line = pts.length === 1
            ? `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)} h0.01`
            : s.kind === "step"
                ? pts
                    .map(([px, py], i) => i
                    ? `H${px.toFixed(1)} V${py.toFixed(1)}`
                    : `M${px.toFixed(1)},${py.toFixed(1)}`)
                    .join(" ")
                : options.smooth
                    ? smoothPath(pts)
                    : pts
                        .map(([px, py], i) => `${i ? "L" : "M"}${px.toFixed(1)},${py.toFixed(1)}`)
                        .join(" ");
        const area = fill && s.kind !== "step" && pts.length > 1
            ? `${line} L${pts[pts.length - 1][0].toFixed(1)},${BOTTOM} L${pts[0][0].toFixed(1)},${BOTTOM} Z`
            : "";
        return { line, area };
    });
    // As many decimals as the tick steps need (2.5 steps show 57.5, not 58).
    const digits = (sc) => Math.min(2, Math.max(...sc.marks.map((v) => String(v).split(".")[1]?.length ?? 0)));
    const draw = (s, sc) => {
        const parts = paths(s, sc);
        const cls = `series-${s.color}`;
        return w `${parts.map((p) => (p.area ? w `<path class=${`area ${cls}`} d=${p.area}></path>` : A))}<path class=${`line ${cls}${s.kind === "step" ? " dashed" : ""}`} data-entity=${s.entityId} d=${parts.map((p) => p.line).join(" ")}></path>`;
    };
    const lane = (s, i) => {
        const top = BOTTOM + LANE_GAP + i * LANE;
        const spells = s.points
            .map(([t, v], j) => ({
            from: t,
            to: Math.min(end, s.points[j + 1]?.[0] ?? end),
            value: v,
        }))
            .filter((p) => p.value !== undefined);
        const rect = (p, cls) => w `<rect class=${cls} x=${x(p.from).toFixed(1)} y=${top} width=${Math.max(1, x(p.to) - x(p.from)).toFixed(1)} height=${LANE - 4} rx="2"></rect>`;
        return w `<g class=${`history-lane series-${s.color}`} data-entity=${s.entityId}>${spells.map((p) => rect(p, "lane-track"))}${spells.filter((p) => p.value === 1).map((p) => rect(p, "lane-on"))}</g>`;
    };
    const grid = axes.find((a) => a.scale)?.scale;
    return w `<svg class="history-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    <defs>${[0, 1, 2, 3, 4].map((c) => w `<linearGradient id=${`history-fill-${c}`} class=${`series-${c}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="fill-top"></stop><stop offset="1" class="fill-bottom"></stop></linearGradient>`)}</defs>
    ${grid?.marks.map((v) => w `<line class="grid" x1=${LEFT} x2=${RIGHT} y1=${y(v, grid)} y2=${y(v, grid)}></line>`)}
    ${axes.map(({ unit, scale: sc }, i) => sc
        ? w `
      ${sc.marks.map((v) => w `<text class="axis" x=${i === 0 ? LEFT - 6 : RIGHT + 6 + (i - 1) * GUTTER} y=${y(v, sc) + 4} text-anchor=${i === 0 ? "end" : "start"}>${text.number(v, digits(sc))}</text>`)}
      ${unit ? w `<text class="axis unit" x=${i === 0 ? 4 : RIGHT + (i - 1) * GUTTER + 4} y="12">${unit}</text>` : A}`
        : A)}
    ${labeledTicks.map((t) => w `<line class="grid" x1=${x(t)} x2=${x(t)} y1=${TOP$1} y2=${END}></line><text class="axis" x=${x(t)} y=${END + 18} text-anchor="middle">${text.time(t, every >= 24)}</text>`)}
    ${axes.map(({ list, scale: sc }) => (sc ? list.map((s) => draw(s, sc)) : A))}
    ${lanes.map(lane)}
    ${hover === undefined ? A : w `<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1=${TOP$1} y2=${END}></line>`}
  </svg>`;
}
/** The time under a pointer over a line chart. */
function lineChartTimeAt(event, element, start, end, twoScales) {
    const box = element.getBoundingClientRect();
    const W = element.viewBox?.baseVal?.width || box.width;
    const px = ((event.clientX - box.left) / box.width) * W;
    const count = typeof twoScales === "number" ? twoScales : twoScales ? 2 : 1;
    const ratio = (px - LEFT) / (W - rightMargin(count) - LEFT);
    return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}

/**
 * Styles for the history view, chart, timeline and dialog. A card maps its own
 * tokens onto the `--history-*` variables (on its host or card); without them
 * the view follows the Home Assistant theme.
 *
 * Palette: `.series-0` … `.series-4` set `--series` from `--history-series-N`.
 * Timeline bands take `--band`, which a card sets per tone class (`.b-<tone>`)
 * or per band (Home Assistant state colors).
 */
const historyStyles = i$3 `
  :host {
    --history-text-color: var(
      --history-text,
      var(--primary-text-color, #1b1b1a)
    );
    --history-muted-color: var(
      --history-muted,
      var(--secondary-text-color, #5b5a55)
    );
    --history-surface-color: var(
      --history-surface,
      var(--ha-card-background, var(--card-background-color, #fff))
    );
    --history-pill-color: var(
      --history-pill,
      var(--secondary-background-color, #f1f2f3)
    );
    --history-accent-color: var(
      --history-accent,
      var(--primary-color, #03a9f4)
    );
    --history-error-color: var(--history-error, var(--error-color, #c62828));
  }
  .series-0 {
    --series: var(--history-series-0, var(--primary-color, #03a9f4));
  }
  .series-1 {
    --series: var(--history-series-1, var(--orange-color, #ff9800));
  }
  .series-2 {
    --series: var(--history-series-2, var(--green-color, #4caf50));
  }
  .series-3 {
    --series: var(--history-series-3, var(--purple-color, #9c27b0));
  }
  .series-4 {
    --series: var(--history-series-4, var(--red-color, #f44336));
  }
  .history-ranges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .history-range {
    min-height: 44px;
    padding: 0 16px;
    border: 0;
    border-radius: 22px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    color: var(--history-text-color);
    background: color-mix(in srgb, var(--history-text-color) 7%, transparent);
    cursor: pointer;
  }
  .history-range[aria-pressed="true"] {
    color: color-mix(
      in srgb,
      var(--history-accent-color) 65%,
      var(--history-text-color)
    );
    background: color-mix(
      in srgb,
      var(--history-accent-color) 24%,
      transparent
    );
    box-shadow: inset 0 0 0 1.5px
      color-mix(in srgb, var(--history-accent-color) 60%, transparent);
  }
  .history-range:focus-visible,
  .history-item:focus-visible,
  .history-action:focus-visible,
  .history-inspector input:focus-visible,
  .history-close:focus-visible {
    outline: 2px solid var(--history-accent-color);
    outline-offset: 2px;
  }
  .history-inspector {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    color: var(--history-muted-color);
    font-size: 12px;
  }
  .history-inspector input {
    flex: 1;
    width: auto;
    padding: 0;
    border: 0;
    background: transparent;
    min-width: 120px;
    min-height: 44px;
    accent-color: var(--history-accent-color);
  }
  .timeline .band-label {
    fill: var(--history-text-color);
    font-size: 11px;
    pointer-events: none;
  }
  .history-plot {
    min-height: 120px;
    touch-action: pan-y;
  }
  .history-chart,
  .timeline {
    display: block;
    width: 100%;
    height: auto;
  }
  .history-chart .grid,
  .timeline .grid {
    stroke: color-mix(in srgb, var(--history-muted-color) 22%, transparent);
  }
  .history-chart .axis,
  .timeline .axis,
  .timeline .lane-label {
    fill: var(--history-muted-color);
    font-size: 12px;
    font-variant-numeric: tabular-nums;
  }
  .timeline .lane-label {
    font-weight: 600;
  }
  .history-chart .line {
    fill: none;
    stroke: var(--series);
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
  }
  .history-chart .dashed {
    stroke-dasharray: 5 4;
  }
  .history-chart .area {
    stroke: none;
  }
  .history-chart .area.series-0 {
    fill: url(#history-fill-0);
  }
  .history-chart .area.series-1 {
    fill: url(#history-fill-1);
  }
  .history-chart .area.series-2 {
    fill: url(#history-fill-2);
  }
  .history-chart .area.series-3 {
    fill: url(#history-fill-3);
  }
  .history-chart .area.series-4 {
    fill: url(#history-fill-4);
  }
  .history-chart .fill-top {
    stop-color: var(--series);
    stop-opacity: var(--history-fill-opacity, 0.32);
  }
  .history-chart .fill-bottom {
    stop-color: var(--series);
    stop-opacity: 0;
  }
  .history-chart .lane-track {
    fill: color-mix(in srgb, var(--series) 16%, transparent);
  }
  .history-chart .lane-on {
    fill: var(--series);
  }
  .history-chart .cursor,
  .timeline .cursor {
    stroke: var(--history-muted-color);
    stroke-dasharray: 3 3;
  }
  .timeline .track {
    fill: color-mix(in srgb, var(--history-muted-color) 10%, transparent);
  }
  .timeline .band {
    fill: var(--band, var(--history-muted-color));
  }
  .timeline .band.b-gap {
    fill: url(#history-hatch);
  }
  .timeline .hatch-bg {
    fill: color-mix(in srgb, var(--history-muted-color) 12%, transparent);
  }
  .timeline .hatch {
    stroke: color-mix(in srgb, var(--history-muted-color) 45%, transparent);
    stroke-width: 2;
  }
  .history-note {
    margin: 40px 0;
    text-align: center;
    font-size: 14px;
    color: var(--history-muted-color);
  }
  .history-note.failed {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 10px 14px;
    margin: 24px 0;
    padding: 12px 14px;
    border-radius: var(--history-tile, 16px);
    color: var(--history-text-color);
    background: color-mix(
      in srgb,
      var(--history-error-color) 16%,
      var(--history-pill-color)
    );
  }
  .history-when {
    margin: -6px 8px 0;
    font-size: 12.5px;
    color: var(--history-muted-color);
    font-variant-numeric: tabular-nums;
  }
  .history-legend {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(150px, 100%), 1fr));
    gap: 6px;
  }
  .history-item {
    display: grid;
    grid-template-columns: auto 1fr;
    align-items: center;
    gap: 2px 10px;
    min-height: 44px;
    padding: 8px 14px;
    border: 0;
    border-radius: var(--history-tile, 16px);
    font: inherit;
    text-align: left;
    color: var(--history-text-color);
    background: var(--history-pill-color);
    cursor: pointer;
  }
  .history-item .swatch {
    grid-row: span 2;
    width: 16px;
    height: 0;
    border-top: 3px solid var(--series);
  }
  .history-item.kind-step .swatch {
    border-top-style: dashed;
  }
  .history-item.kind-lane .swatch {
    height: 10px;
    border-top: 0;
    border-radius: 2px;
    background: var(--series);
  }
  .history-item .label {
    font-size: 0.78rem;
    color: var(--history-muted-color);
    overflow-wrap: anywhere;
  }
  .history-item strong {
    font-size: 1rem;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
  dialog.history-dialog {
    color: var(--history-text-color);
    background: var(--history-surface-color);
    border: 0;
    border-radius: var(--history-radius, 24px);
    padding: 16px;
    width: min(640px, calc(100vw - 24px));
    max-width: calc(100vw - 24px);
    max-height: calc(100dvh - 32px);
    overflow: auto;
    box-shadow: 0 16px 60px #0006;
  }
  dialog.history-dialog[open] {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  dialog.history-dialog::backdrop {
    background: #0008;
  }
  .history-top {
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 8px;
  }
  .history-title {
    flex: 1;
    min-width: 0;
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    color: var(--history-muted-color);
    overflow-wrap: anywhere;
  }
  .history-subtitle {
    display: block;
    font-size: 13px;
    font-weight: 500;
  }
  .history-action,
  .history-close {
    flex: 0 0 44px;
    width: 44px;
    height: 44px;
    padding: 0;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 50%;
    color: var(--history-muted-color);
    background: var(--history-pill-color);
    cursor: pointer;
  }
  .history-action svg,
  .history-close svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
    stroke-linecap: round;
  }
  @media (max-width: 400px) {
    dialog.history-dialog {
      padding: 12px;
    }
  }
`;

/** Room left and right of the bands, so edge time labels are not clipped. */
const SIDE = 22, TOP = 4, LABEL = 18, BAND = 24, GAP = 12, AXIS = 24;
function every(hours, narrow) {
    if (hours <= 6)
        return narrow ? 2 : 1;
    if (hours <= 24)
        return narrow ? 6 : 4;
    return narrow ? 48 : 24;
}
/**
 * One lane per entity with a colored band per state, from `start` to `end`.
 * A silent (unavailable) spell is hatched; time before any record is empty.
 */
function timeline(lanes, start, end, hover, text, W = 600) {
    const RIGHT = W - SIDE;
    const H = TOP +
        lanes.length * (LABEL + BAND) +
        Math.max(0, lanes.length - 1) * GAP +
        AXIS;
    const bottom = H - AXIS;
    const x = (t) => SIDE +
        ((Math.min(Math.max(t, start), end) - start) / (end - start)) *
            (RIGHT - SIDE);
    const step = every((end - start) / 3600000, W < 480);
    const ticks = [];
    const hour = new Date(start);
    hour.setMinutes(0, 0, 0);
    let midnights = 0;
    for (let t = hour.getTime(); t <= end; t += 3600000) {
        if (t < start)
            continue;
        const h = new Date(t).getHours();
        if (step >= 24 ? h === 0 && midnights++ % (step / 24) === 0 : h % step === 0)
            ticks.push(t);
    }
    const top = (i) => TOP + i * (LABEL + BAND + GAP);
    return w `<svg class="timeline" viewBox="0 0 ${W} ${H}" role="img" aria-label=${text.label}>
    <title>${text.label}</title>
    <defs>
      <pattern id="history-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect class="hatch-bg" width="6" height="6"></rect>
        <line class="hatch" x1="0" y1="0" x2="0" y2="6"></line>
      </pattern>
    </defs>
    ${ticks.map((t) => w `<line class="grid" x1=${x(t)} x2=${x(t)} y1=${TOP} y2=${bottom}></line><text class="axis" x=${x(t)} y=${bottom + 17} text-anchor="middle">${text.time(t, step >= 24)}</text>`)}
    ${lanes.map((lane, i) => {
        const y = top(i) + LABEL;
        return w `<g class="band-lane" data-lane=${text.laneId?.(lane) ?? lane.kind}>
        <text class="lane-label" x=${SIDE} y=${top(i) + 13}>${text.lane(lane)}</text>
        <rect class="track" x=${SIDE} y=${y} width=${RIGHT - SIDE} height=${BAND} rx="4"></rect>
        ${lane.marks.map(([t, state], j) => {
            const from = x(t), to = x(lane.marks[j + 1]?.[0] ?? end);
            if (to - from <= 0)
                return A;
            const tone = state === undefined ? "gap" : text.tone(lane, state);
            const color = state === undefined ? undefined : text.color?.(lane, state);
            const label = text.stateLabel?.(lane, state);
            return w `<rect class=${`band b-${tone}`} data-state=${state ?? ""} style=${color ? `--band: ${color}` : ""} x=${from} y=${y} width=${to - from} height=${BAND}>${label ? w `<title>${text.lane(lane)}: ${label}</title>` : A}</rect>${label && to - from > label.length * 7 + 16 ? w `<text class=${`band-label b-${tone}`} x=${from + 8} y=${y + 16}>${label}</text>` : A}`;
        })}
      </g>`;
    })}
    ${hover === undefined ? A : w `<line class="cursor" x1=${x(hover)} x2=${x(hover)} y1=${TOP} y2=${bottom}></line>`}
  </svg>`;
}
/** The time under a pointer over a timeline. */
function timelineTimeAt(event, element, start, end) {
    const box = element.getBoundingClientRect();
    const W = element.viewBox?.baseVal?.width || box.width;
    const px = ((event.clientX - box.left) / box.width) * W;
    const ratio = (px - SIDE) / (W - 2 * SIDE);
    return start + Math.min(1, Math.max(0, ratio)) * (end - start);
}

/**
 * The body of a history view, shared by a card's dialog and the history card:
 * range buttons, the chart with a pointer readout, the time read, and a legend
 * whose entries open each entity's more-info.
 */
function historyView(ctl, o) {
    const { data, window: range, hover, error } = ctl;
    const long = ctl.range > 48;
    const legend = data !== undefined && range ? o.legend(data, hover) : [];
    return b `<div
      class="history-ranges"
      role="group"
      aria-label=${o.strings.ranges}
    >
      ${(o.ranges ?? RANGES).map((hours) => b `<button
            class="history-range"
            type="button"
            data-range=${hours}
            aria-pressed=${String(ctl.range === hours)}
            @click=${() => void ctl.reload(hours, o.strings.failed)}
          >
            ${o.format.span(hours)}
          </button>`)}
    </div>
    <div
      class="history-plot"
      aria-busy=${String(ctl.loading)}
      @pointermove=${(e) => {
        const svg = e.currentTarget.querySelector("svg");
        if (!svg || !range || data === undefined)
            return;
        ctl.setHover(o.timeAt(e, svg, range, data));
    }}
      @pointerleave=${() => ctl.setHover(undefined)}
    >
      ${error
        ? b `<div class="history-note failed" role="alert">
              <span>${error}</span>
              <button
                class="history-range"
                type="button"
                data-retry
                @click=${() => void ctl.reload(ctl.range, o.strings.failed)}
              >
                ${o.strings.retry}
              </button>
            </div>`
        : data === undefined || !range
            ? b `<p class="history-note" role="status">
                ${o.strings.loading}
              </p>`
            : o.isEmpty(data)
                ? b `<p class="history-note">${o.strings.empty}</p>`
                : o.chart(data, range, hover, Math.max(280, ctl.width))}
    </div>
    ${data !== undefined && range && !error && !o.isEmpty(data)
        ? b `<label class="history-inspector"
            >${o.strings.inspect}
            <input
              type="range"
              min=${range[0]}
              max=${range[1]}
              step=${(range[1] - range[0]) / 200}
              .value=${String(hover ?? range[1])}
              aria-valuetext=${o.format.moment(hover ?? range[1])}
              @input=${(e) => ctl.setHover(Number(e.target.value))}
            />
          </label>`
        : A}
    <p class="history-when" aria-live="polite">
      ${hover === undefined ? o.strings.now : long ? o.format.moment(hover) : o.format.time(hover)}
    </p>
    <div class="history-legend">
      ${data !== undefined && o.renderLegend
        ? o.renderLegend(data, hover)
        : legend.map((entry) => b `<button
                  class=${`history-item series-${entry.color}${entry.kind ? ` kind-${entry.kind}` : ""}`}
                  type="button"
                  data-series=${entry.entityId}
                  title=${entry.title ?? A}
                  @click=${(e) => o.select(entry.entityId, e)}
                >
                  <span class="swatch" aria-hidden="true"></span>
                  <span class="label">${entry.name}</span>
                  <strong>${entry.value}</strong>
                </button>`)}
    </div>`;
}

/** The History card's and its editor's own words, in English and Bokmål. */
const en = {
    title: "History",
    entitiesRequired: "Add at least one entity under entities",
    entities: "Entities",
    cardTitle: "Title",
    range: "Default range",
    fill: "Translucent fill under lines",
    smooth: "Smooth lines",
    showCurrent: "Show current values",
    appearance: "Appearance",
    defaultAppearance: "Default",
    thirdUnit: "Not drawn: the chart has room for two units",
    missing: "Entity not found",
    hours6: "6 hours",
    hours24: "24 hours",
    days7: "7 days",
};
const nb = {
    title: "Historikk",
    entitiesRequired: "Legg til minst én entitet under entities",
    entities: "Entiteter",
    cardTitle: "Tittel",
    range: "Standard tidsrom",
    fill: "Gjennomsiktig fyll under linjene",
    smooth: "Myke linjer",
    showCurrent: "Vis nåverdier",
    appearance: "Utseende",
    defaultAppearance: "Standard",
    thirdUnit: "Ikke tegnet: diagrammet har plass til to enheter",
    missing: "Fant ikke entiteten",
    hours6: "6 timer",
    hours24: "24 timer",
    days7: "7 dager",
};
function cardStrings(hass) {
    return historyLanguage(hass) === "nb" ? nb : en;
}

/**
 * The History card's visual editor, on Home Assistant's own form. Names given
 * in YAML (`{entity, name}`) are kept when the entity list changes.
 */
class HistoryCardEditor extends i {
    setConfig(config) {
        this.config = config;
    }
    schema() {
        const c = cardStrings(this.hass);
        return [
            { name: "title", selector: { text: {} } },
            {
                name: "entities",
                required: true,
                selector: { entity: { multiple: true } },
            },
            {
                name: "hours",
                selector: {
                    select: {
                        mode: "dropdown",
                        options: [
                            { value: "6", label: c.hours6 },
                            { value: "24", label: c.hours24 },
                            { value: "168", label: c.days7 },
                        ],
                    },
                },
            },
            { name: "show_current", selector: { boolean: {} } },
            { name: "fill", selector: { boolean: {} } },
            { name: "smooth", selector: { boolean: {} } },
            {
                name: "appearance",
                selector: {
                    select: {
                        options: [
                            { value: "default", label: c.defaultAppearance },
                            { value: "bubble", label: "Bubble" },
                        ],
                    },
                },
            },
        ];
    }
    changed(e) {
        e.stopPropagation();
        const value = e.detail.value;
        const named = new Map((this.config?.entities ?? [])
            .filter((i) => typeof i !== "string" && !!i.name)
            .map((i) => [i.entity, i]));
        const entities = (value.entities ?? []).map((id) => named.get(id) ?? id);
        const config = {
            ...this.config,
            ...value,
            entities,
            ...(value.hours !== undefined ? { hours: Number(value.hours) } : {}),
        };
        this.config = config;
        this.dispatchEvent(new CustomEvent("config-changed", {
            detail: { config },
            bubbles: true,
            composed: true,
        }));
    }
    render() {
        if (!this.hass || !this.config)
            return A;
        const c = cardStrings(this.hass);
        const labels = {
            title: c.cardTitle,
            entities: c.entities,
            hours: c.range,
            show_current: c.showCurrent,
            fill: c.fill,
            smooth: c.smooth,
            appearance: c.appearance,
        };
        const data = {
            fill: true,
            smooth: false,
            show_current: true,
            appearance: "default",
            ...this.config,
            hours: String(this.config.hours ?? 24),
            entities: this.config.entities.map((i) => typeof i === "string" ? i : i.entity),
        };
        return b `<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${this.schema()}
      .computeLabel=${(s) => labels[s.name] ?? s.name}
      @value-changed=${this.changed}
    ></ha-form>`;
    }
}
HistoryCardEditor.properties = { hass: { attribute: false }, config: { state: true } };
HistoryCardEditor.styles = i$3 `
    ha-form {
      display: block;
      padding: 8px 0;
    }
  `;
if (!customElements.get("lovelace-card-history-editor"))
    customElements.define("lovelace-card-history-editor", HistoryCardEditor);

/** Domains whose states are on or off: drawn as lanes under the chart. */
const ON_OFF = [
    "binary_sensor",
    "switch",
    "light",
    "fan",
    "input_boolean",
    "lock",
    "cover",
    "valve",
    "siren",
];
/** How an entity is drawn: a line when it is a measurement, a lane when on/off, else a timeline. */
function kindOf(entityId, state) {
    const domain = entityId.split(".")[0];
    if (ON_OFF.includes(domain))
        return "lane";
    if (isMeasurement(state) ||
        (state && numeric(state.state) !== undefined && domain === "sensor"))
        return "line";
    return "text";
}
/**
 * The History card: a chart of any entities, from Home Assistant's recorder.
 * Measurements are lines on up to two scales with a translucent fill; on/off
 * entities are lanes under them; other states are a timeline.
 */
class HistoryCard extends i {
    constructor() {
        super(...arguments);
        this.history = new HistoryController(this, (range, end) => this.load(range, end));
        this.loadedFor = "";
    }
    setConfig(config) {
        if (!Array.isArray(config?.entities) || !config.entities.length)
            throw new Error(cardStrings().entitiesRequired);
        for (const item of config.entities) {
            const id = typeof item === "string" ? item : item?.entity;
            if (typeof id !== "string" || !id.includes("."))
                throw new Error(`${cardStrings().entitiesRequired}: ${JSON.stringify(item)}`);
        }
        const hours = RANGES.some((hours) => hours === config.hours) ? config.hours : 24;
        this.config = {
            fill: true,
            smooth: false,
            show_current: true,
            appearance: "default",
            ...config,
            hours,
        };
        this.setAttribute("data-appearance", this.config.appearance === "bubble" ? "bubble" : "default");
        this.history.range = hours;
        this.loadedFor = "";
    }
    getCardSize() {
        return 6;
    }
    static getConfigElement() {
        return document.createElement("lovelace-card-history-editor");
    }
    static getStubConfig(hass) {
        const entities = Object.keys(hass?.states ?? {})
            .filter((id) => id.startsWith("sensor.") &&
            hass.states[id].attributes.device_class === "temperature")
            .slice(0, 2);
        return {
            type: "custom:lovelace-card-history",
            entities: entities.length ? entities : ["sensor.temperature"],
        };
    }
    get items() {
        return (this.config?.entities ?? []).map((item) => typeof item === "string" ? { entity: item } : item);
    }
    name(item) {
        const friendly = this.hass?.states[item.entity]?.attributes.friendly_name;
        return (item.name ??
            (typeof friendly === "string" && friendly ? friendly : item.entity));
    }
    /** Lines (on up to two scales) and lanes for the chart, text entities for the timeline. */
    plan() {
        const states = this.hass?.states ?? {};
        const lines = [];
        const lanes = [];
        const texts = [];
        let slot = 0;
        for (const item of this.items) {
            const kind = kindOf(item.entity, states[item.entity]);
            if (kind === "text")
                texts.push(item);
            else
                (kind === "line" ? lines : lanes).push({
                    entityId: item.entity,
                    color: slot++ % 5,
                    kind,
                });
        }
        const unit = (s) => String(states[s.entityId]?.attributes.unit_of_measurement ?? "");
        const first = lines[0] ? unit(lines[0]) : "";
        const second = lines.map(unit).find((u) => u !== first);
        const drawn = lines.filter((s) => [first, second].includes(unit(s)));
        return {
            lines: drawn,
            hidden: lines.filter((s) => !drawn.includes(s)),
            lanes,
            texts,
            leftUnit: first,
        };
    }
    async load(range, end) {
        const hass = this.hass;
        const { lines, lanes, texts } = this.plan();
        const connection = historyConnection(hass);
        const [series, timelineLanes] = await Promise.all([
            loadSeries(connection, [...lines, ...lanes], hass.states, range, {
                now: end,
            }),
            texts.length
                ? loadLanes(connection, texts.map((t) => ({ kind: "text", entityId: t.entity })), hass.states, range, { now: end })
                : Promise.resolve([]),
        ]);
        return { series, lanes: timelineLanes };
    }
    updated() {
        if (!this.hass || !this.config)
            return;
        const key = JSON.stringify(this.config.entities);
        if (key !== this.loadedFor) {
            this.loadedFor = key;
            this.history.reset();
            void this.history.reload(this.history.range, historyStrings(this.hass).failed);
        }
        this.history.observe(this.shadowRoot?.querySelector(".history-plot"));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.loadedFor = "";
    }
    connectedCallback() {
        super.connectedCallback();
        this.requestUpdate();
    }
    moreInfo(entityId) {
        this.dispatchEvent(new CustomEvent("hass-more-info", {
            detail: { entityId },
            bubbles: true,
            composed: true,
        }));
    }
    stateLabel(entityId, value) {
        const t = historyStrings(this.hass);
        if (value === undefined)
            return "—";
        const state = this.hass?.states[entityId];
        const formatted = state
            ? this.hass?.formatEntityState?.(state, value)
            : undefined;
        if (formatted && formatted !== value)
            return formatted;
        if (value === "unavailable")
            return t.unavailable;
        if (value === "on" || value === "off")
            return t[value];
        return value;
    }
    render() {
        if (!this.config || !this.hass)
            return A;
        const t = historyStrings(this.hass);
        const c = cardStrings(this.hass);
        const f = historyFormat(this.hass);
        const plan = this.plan();
        const title = this.config.title ?? c.title;
        const missing = this.items.filter((i) => !this.hass.states[i.entity]);
        const color = (id) => [...plan.lines, ...plan.lanes].find((s) => s.entityId === id)?.color ?? 0;
        const textTone = (lane, state) => {
            const seen = [
                ...new Set(lane.marks.flatMap(([, s]) => (s === undefined ? [] : [s]))),
            ];
            return `s${Math.max(0, seen.indexOf(state)) % 5}`;
        };
        const current = this.config.show_current
            ? plan.lines.slice(0, 2).map((s) => {
                const state = this.hass.states[s.entityId];
                const value = numeric(state?.state);
                const unit = String(state?.attributes.unit_of_measurement ?? "");
                return b `<button
            class="now series-${s.color}"
            type="button"
            title=${this.name({ entity: s.entityId })}
            @click=${() => this.moreInfo(s.entityId)}
          >
            <span class="dot"></span
            ><strong>${value === undefined ? "—" : f.reading(value)}</strong
            ><small>${unit}</small>
          </button>`;
            })
            : [];
        return b `<ha-card>
      ${title ? b `<div class="title">${title}</div>` : A}
      ${current.length ? b `<div class="current">${current}</div>` : A}
      ${historyView(this.history, {
            strings: t,
            format: f,
            isEmpty: (d) => d.series.every((s) => s.points.every(([, v]) => v === undefined)) &&
                d.lanes.every((l) => l.marks.every(([, s]) => s === undefined)),
            chart: (d, [start, end], hover, width) => {
                const text = {
                    number: f.number,
                    time: f.time,
                    label: `${t.history}: ${title}`,
                };
                return b `${d.series.length
                    ? lineChart(d.series, start, end, hover, text, {
                        width,
                        leftUnit: plan.leftUnit || undefined,
                        fill: this.config.fill,
                        smooth: this.config.smooth,
                    })
                    : A}${d.lanes.length
                    ? timeline(d.lanes, start, end, hover, {
                        time: f.time,
                        label: `${t.history}: ${title}`,
                        lane: (lane) => this.name({ entity: lane.entityId }),
                        tone: textTone,
                    }, width)
                    : A}`;
            },
            timeAt: (e, svg, [start, end], d) => svg.classList.contains("timeline")
                ? timelineTimeAt(e, svg, start, end)
                : lineChartTimeAt(e, svg, start, end, units(d.series, plan.leftUnit || undefined)[1] !== undefined),
            legend: (d, at) => {
                const entries = d.series.map((s) => {
                    const name = this.name(this.items.find((i) => i.entity === s.entityId) ?? {
                        entity: s.entityId,
                    });
                    if (s.kind === "lane") {
                        const state = at === undefined
                            ? s.states[s.states.length - 1]?.[1]
                            : stateAt(s, at);
                        return {
                            entityId: s.entityId,
                            name,
                            color: s.color,
                            kind: "lane",
                            value: this.stateLabel(s.entityId, state),
                        };
                    }
                    const value = at === undefined
                        ? s.points[s.points.length - 1]?.[1]
                        : valueAt(s, at);
                    return {
                        entityId: s.entityId,
                        name,
                        color: s.color,
                        value: value === undefined ? "—" : f.reading(value, s.unit, 2),
                    };
                });
                for (const lane of d.lanes) {
                    const state = at === undefined
                        ? lane.marks[lane.marks.length - 1]?.[1]
                        : stateAt(lane, at);
                    const item = this.items.find((i) => i.entity === lane.entityId) ?? {
                        entity: lane.entityId,
                    };
                    entries.push({
                        entityId: lane.entityId,
                        name: this.name(item),
                        color: state === undefined
                            ? 0
                            : Number(textTone(lane, state).slice(1)),
                        kind: "lane",
                        value: this.stateLabel(lane.entityId, state),
                    });
                }
                for (const s of plan.hidden) {
                    const state = this.hass.states[s.entityId];
                    entries.push({
                        entityId: s.entityId,
                        name: this.name({ entity: s.entityId }),
                        color: color(s.entityId),
                        value: state ? this.stateLabel(s.entityId, state.state) : "—",
                        title: c.thirdUnit,
                    });
                }
                return entries;
            },
            select: (id) => this.moreInfo(id),
        })}
      ${missing.length ? b `<p class="missing" role="status">${c.missing}: ${missing.map((m) => m.entity).join(", ")}</p>` : A}
    </ha-card>`;
    }
}
HistoryCard.properties = { hass: { attribute: false }, config: { state: true } };
HistoryCard.styles = [
    historyStyles,
    i$3 `
      :host {
        display: block;
        --history-series-0: var(--red-color, #e5484d);
        --history-series-1: var(--blue-color, #0b93d6);
        --history-series-2: var(--green-color, #2e9e5b);
        --history-series-3: var(--purple-color, #8e44ad);
        --history-series-4: var(--amber-color, #d99a06);
      }
      :host([data-appearance="bubble"]) {
        --history-surface: var(--bubble-main-background-color);
        --history-pill: var(--bubble-secondary-background-color);
        --history-tile: var(--bubble-sub-button-border-radius, 22px);
      }
      ha-card {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 16px;
        color: var(--history-text-color);
        background: var(--history-surface-color);
      }
      :host([data-appearance="bubble"]) ha-card {
        border: var(--bubble-border, none);
        border-radius: var(--bubble-border-radius, 32px);
      }
      .title {
        padding-left: 4px;
        font-size: 17px;
        font-weight: 700;
        color: var(--history-muted-color);
      }
      .current {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        gap: 8px 16px;
      }
      .now {
        display: flex;
        align-items: baseline;
        gap: 6px;
        padding: 2px 6px;
        border: 0;
        border-radius: 12px;
        font: inherit;
        color: var(--history-text-color);
        background: none;
        cursor: pointer;
      }
      .now:focus-visible {
        outline: 2px solid var(--history-accent-color);
      }
      .now .dot {
        align-self: center;
        width: 9px;
        height: 9px;
        border-radius: 50%;
        background: var(--series);
      }
      .now strong {
        font-size: 32px;
        font-weight: 600;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }
      .now small {
        font-size: 15px;
        color: var(--history-muted-color);
      }
      .timeline .b-s0 {
        --band: var(--history-series-0);
      }
      .timeline .b-s1 {
        --band: var(--history-series-1);
      }
      .timeline .b-s2 {
        --band: var(--history-series-2);
      }
      .timeline .b-s3 {
        --band: var(--history-series-3);
      }
      .timeline .b-s4 {
        --band: var(--history-series-4);
      }
      .timeline .band {
        fill-opacity: 0.75;
      }
      .missing {
        font-size: 14px;
        color: var(--history-muted-color);
      }
    `,
];
if (!customElements.get("lovelace-card-history"))
    customElements.define("lovelace-card-history", HistoryCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: "lovelace-card-history",
    name: "History Card",
    description: "History of any sensors: translucent lines on two scales, on/off lanes and state timelines.",
    preview: true,
});

export { HistoryCard, kindOf };
