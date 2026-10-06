function t(t,e,n,i){var o,s=arguments.length,r=s<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,n):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,n,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(s<3?o(r):s>3?o(e,n,r):o(e,n))||r);return s>3&&r&&Object.defineProperty(e,n,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,n=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let s=class{constructor(t,e,n){if(this._$cssResult$=!0,n!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(n&&void 0===t){const n=void 0!==e&&1===e.length;n&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),n&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const n=1===t.length?t[0]:e.reduce((e,n,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(n)+t[i+1],t[0]);return new s(n,t,i)},a=n?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const n of t.cssRules)e+=n.cssText;return(t=>new s("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,m=globalThis,f=m.trustedTypes,g=f?f.emptyScript:"",_=m.reactiveElementPolyfillSupport,b=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let n=t;switch(e){case Boolean:n=null!==t;break;case Number:n=null===t?null:Number(t);break;case Object:case Array:try{n=JSON.parse(t)}catch(t){n=null}}return n}},v=(t,e)=>!c(t,e),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=$){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const n=Symbol(),i=this.getPropertyDescriptor(t,n,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,n){const{get:i,set:o}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const s=i?.call(this);o?.call(this,e),this.requestUpdate(t,s,n)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const n of e)this.createProperty(n,t[n])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,n]of e)this.elementProperties.set(t,n)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const n=this._$Eu(t,e);void 0!==n&&this._$Eh.set(n,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const n=new Set(t.flat(1/0).reverse());for(const t of n)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const n=e.attribute;return!1===n?void 0:"string"==typeof n?n:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const n of e.keys())this.hasOwnProperty(n)&&(t.set(n,this[n]),delete this[n]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(n)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const n of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=n.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,n){this._$AK(t,n)}_$ET(t,e){const n=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,n);if(void 0!==i&&!0===n.reflect){const o=(void 0!==n.converter?.toAttribute?n.converter:y).toAttribute(e,n.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const n=this.constructor,i=n._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=n.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=i;const s=o.fromAttribute(e,t.type);this[i]=s??this._$Ej?.get(i)??s,this._$Em=null}}requestUpdate(t,e,n,i=!1,o){if(void 0!==t){const s=this.constructor;if(!1===i&&(o=this[t]),n??=s.getPropertyOptions(t),!((n.hasChanged??v)(o,e)||n.useDefault&&n.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(s._$Eu(t,n))))return;this.C(t,e,n)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:n,reflect:i,wrapped:o},s){n&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,s??e??this[t]),!0!==o||void 0!==s)||(this._$AL.has(t)||(this.hasUpdated||n||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,n]of t){const{wrapped:t}=n,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,n,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,_?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,A=t=>t,E=w.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,k="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,z="?"+P,C=`<${z}>`,M=document,j=()=>M.createComment(""),U=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,T="[ \t\n\f\r]",I=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,R=/>/g,H=RegExp(`>|${T}(?:([^\\s"'>=/]+)(${T}*=${T}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,W=t=>(e,...n)=>({_$litType$:t,strings:e,values:n}),F=W(1),q=W(2),V=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),Z=new WeakMap,G=M.createTreeWalker(M,129);function Y(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const n=t.length-1,i=[];let o,s=2===e?"<svg>":3===e?"<math>":"",r=I;for(let e=0;e<n;e++){const n=t[e];let a,c,l=-1,d=0;for(;d<n.length&&(r.lastIndex=d,c=r.exec(n),null!==c);)d=r.lastIndex,r===I?"!--"===c[1]?r=N:void 0!==c[1]?r=R:void 0!==c[2]?(B.test(c[2])&&(o=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=o??I,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?H:'"'===c[3]?D:L):r===D||r===L?r=H:r===N||r===R?r=I:(r=H,o=void 0);const h=r===H&&t[e+1].startsWith("/>")?" ":"";s+=r===I?n+C:l>=0?(i.push(a),n.slice(0,l)+k+n.slice(l)+P+h):n+P+(-2===l?e:h)}return[Y(t,s+(t[n]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class X{constructor({strings:t,_$litType$:e},n){let i;this.parts=[];let o=0,s=0;const r=t.length-1,a=this.parts,[c,l]=K(t,e);if(this.el=X.createElement(c,n),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=G.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(k)){const e=l[s++],n=i.getAttribute(t).split(P),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:n,ctor:"."===r[1]?it:"?"===r[1]?ot:"@"===r[1]?st:nt}),i.removeAttribute(t)}else t.startsWith(P)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(P),e=t.length-1;if(e>0){i.textContent=E?E.emptyScript:"";for(let n=0;n<e;n++)i.append(t[n],j()),G.nextNode(),a.push({type:2,index:++o});i.append(t[e],j())}}}else if(8===i.nodeType)if(i.data===z)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(P,t+1));)a.push({type:7,index:o}),t+=P.length-1}o++}}static createElement(t,e){const n=M.createElement("template");return n.innerHTML=t,n}}function Q(t,e,n=t,i){if(e===V)return e;let o=void 0!==i?n._$Co?.[i]:n._$Cl;const s=U(e)?void 0:e._$litDirective$;return o?.constructor!==s&&(o?._$AO?.(!1),void 0===s?o=void 0:(o=new s(t),o._$AT(t,n,i)),void 0!==i?(n._$Co??=[])[i]=o:n._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:n}=this._$AD,i=(t?.creationScope??M).importNode(e,!0);G.currentNode=i;let o=G.nextNode(),s=0,r=0,a=n[0];for(;void 0!==a;){if(s===a.index){let e;2===a.type?e=new et(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new rt(o,this,t)),this._$AV.push(e),a=n[++r]}s!==a?.index&&(o=G.nextNode(),s++)}return G.currentNode=M,i}p(t){let e=0;for(const n of this._$AV)void 0!==n&&(void 0!==n.strings?(n._$AI(t,n,e),e+=n.strings.length-2):n._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,n,i){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=n,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),U(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==V&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&U(this._$AH)?this._$AA.nextSibling.data=t:this.T(M.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:n}=t,i="number"==typeof n?this._$AC(t):(void 0===n.el&&(n.el=X.createElement(Y(n.h,n.h[0]),this.options)),n);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new tt(i,this),n=t.u(this.options);t.p(e),this.T(n),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new X(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let n,i=0;for(const o of t)i===e.length?e.push(n=new et(this.O(j()),this.O(j()),this,this.options)):n=e[i],n._$AI(o),i++;i<e.length&&(this._$AR(n&&n._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class nt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,n,i,o){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,n.length>2||""!==n[0]||""!==n[1]?(this._$AH=Array(n.length-1).fill(new String),this.strings=n):this._$AH=J}_$AI(t,e=this,n,i){const o=this.strings;let s=!1;if(void 0===o)t=Q(this,t,e,0),s=!U(t)||t!==this._$AH&&t!==V,s&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,i[n+r],e,r),a===V&&(a=this._$AH[r]),s||=!U(a)||a!==this._$AH[r],a===J?t=J:t!==J&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}s&&!i&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class ot extends nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class st extends nt{constructor(t,e,n,i,o){super(t,e,n,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??J)===V)return;const n=this._$AH,i=t===J&&n!==J||t.capture!==n.capture||t.once!==n.once||t.passive!==n.passive,o=t!==J&&(n===J||i);i&&this.element.removeEventListener(this.name,this,n),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,n){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=n}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=w.litHtmlPolyfillSupport;at?.(X,et),(w.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;class lt extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,n)=>{const i=n?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=n?.renderBefore??null;i._$litPart$=o=new et(e.insertBefore(j(),t),t,void 0,n??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const dt=ct.litElementPolyfillSupport;dt?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,n)=>{void 0!==n?n.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},ut=(t=pt,e,n)=>{const{kind:i,metadata:o}=n;let s=globalThis.litPropertyMetadata.get(o);if(void 0===s&&globalThis.litPropertyMetadata.set(o,s=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),s.set(n.name,t),"accessor"===i){const{name:i}=n;return{set(n){const o=e.get.call(this);e.set.call(this,n),this.requestUpdate(i,o,t,!0,n)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=n;return function(n){const o=this[i];e.call(this,n),this.requestUpdate(i,o,t,!0,n)}}throw Error("Unsupported decorator location: "+i)};function mt(t){return(e,n)=>"object"==typeof n?ut(t,e,n):((t,e,n)=>{const i=e.hasOwnProperty(n);return e.constructor.createProperty(n,t),i?Object.getOwnPropertyDescriptor(e,n):void 0})(t,e,n)}function ft(t){return mt({...t,state:!0,attribute:!1})}var gt,_t;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(gt||(gt={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(_t||(_t={}));var bt=function(t,e,n,i){i=i||{},n=null==n?{}:n;var o=new Event(e,{bubbles:void 0===i.bubbles||i.bubbles,cancelable:Boolean(i.cancelable),composed:void 0===i.composed||i.composed});return o.detail=n,t.dispatchEvent(o),o};const yt="lay-z-spa-card",vt="lay-z-spa-card-editor",$t={climate:"climate.layzspa_temperature_control",bubbles:"switch.layzspa_airbubbles",heater:"binary_sensor.layzspa_heater",ready:"binary_sensor.layzspa_ready",time_to_ready:"sensor.layzspa_time_to_ready",ambient:"number.layzspa_amb_temp_c",error:"sensor.layzspa_error",connection:"binary_sensor.layzspa_connection",power_switch:"switch.jacuzzi",power:"sensor.jacuzzi_power",energy_today:"sensor.jacuzzi_energia_energy_daily",usage:"input_select.jacuzzi_uso",desired:"input_number.jacuzzi_temp_deseada",maintenance:"input_number.jacuzzi_temp_mantenimiento",plan:"sensor.jacuzzi_plan",planner:"input_boolean.jacuzzi_planificador",observe:"input_boolean.jacuzzi_planificador_observar",grid_extra:"sensor.jacuzzi_extra_red"},xt=new Set(["unavailable","unknown"]);function wt(t){if(null==t||""===t)return null;const e=Number(t);return Number.isFinite(e)?e:null}function At(t){return!!t&&!xt.has(t.state)}function Et(t){return At(t)?wt(t.state):null}function St(t,e){return e?t[e]:void 0}function kt(t,e){if("off"===St(t,e.power_switch)?.state)return"no_power";const n=St(t,e.connection);if(!!e.connection&&"on"!==n?.state){const n=Et(St(t,e.power));return null!==n&&n<1?"rcd_tripped":"board_offline"}return At(t[e.climate])?"ok":"board_offline"}const Pt={no_power:{icon:"mdi:power-plug-off",title:"Sin corriente",detail:"Enchufe del jacuzzi apagado"},rcd_tripped:{icon:"mdi:flash-alert",title:"Sin corriente en la bomba",detail:"Rearma el diferencial del cable del jacuzzi"},board_offline:{icon:"mdi:wifi-off",title:"Placa WiFi sin conexión",detail:"La bomba tiene corriente pero la placa no responde"}};function zt(t){const e=Math.round(60*t);if(e<1)return"<1 min";const n=Math.floor(e/60),i=e%60;return 0===n?`${i} min`:0===i?`${n} h`:`${n} h ${i} min`}function Ct(t){return String(Math.round(t)).replace(/\B(?=(\d{3})+(?!\d))/g,".")}function Mt(t){let e=wt(t.min_temp)??20,n=wt(t.max_temp)??40;e>=n&&(e=20,n=40);const i=wt(t.target_temp_step);return{min:e,max:n,step:null!==i&&i>0?i:1}}function jt(t,e,n){return t?null!==e&&e===t.value||n-t.at>1e4?null:t.value:null}function Ut(t){const e=Math.round(10*t)/10;return(Number.isInteger(e)?String(e):e.toFixed(1)).replace(".",",")}const Ot=210,Tt=80;function It(t,e,n,i){const o=(i-90)*Math.PI/180;return{x:t+n*Math.cos(o),y:e+n*Math.sin(o)}}function Nt(t,e,n,i,o){const s=It(t,e,n,o),r=It(t,e,n,i),a=o-i<=180?"0":"1";return`M ${s.x} ${s.y} A ${n} ${n} 0 ${a} 0 ${r.x} ${r.y}`}function Rt(t,e,n,i){const o=Math.round(t/i)*i;return Number(Math.min(n,Math.max(e,o)).toFixed(2))}function Ht(t,e,n){const i=Math.min(1,Math.max(0,(t-e)/(n-e)));return Ot+300*i}function Lt(t,e,n,i){return Rt(e+function(t){let e;return e=t>=Ot?(t-Ot)/300:t<=150?(t+360-Ot)/300:t-150<Ot-t?1:0,Math.min(1,Math.max(0,e))}(t)*(n-e),e,n,i)}function Dt(t,e){let n=180*Math.atan2(e,t)/Math.PI+90;return n<0&&(n+=360),n}function Bt(t){const e=new Set(t),n={};for(const[t,i]of Object.entries($t))e.has(i)&&(n[t]=i);const i=n.climate??t.find(t=>t.startsWith("climate.")&&t.includes("layzspa"))??$t.climate;return{...n,climate:i}}const Wt=["Hoy","Siempre"];function Ft(t,e){return!!(e.planner&&e.usage&&e.desired&&e.maintenance)&&"on"===t[e.planner]?.state}function qt(t,e){return!!e.usage&&Wt.includes(t[e.usage]?.state??"")}function Vt(t){return Mt({min_temp:t.min,max_temp:t.max,target_temp_step:t.step})}function Jt(t,e){if(Ft(t,e)){const n=qt(t,e),i=n?e.desired:e.maintenance,o=t[i],{min:s,max:r,step:a}=Vt(o?.attributes??{});return{kind:"helper",entity:i,value:Et(o),min:s,max:r,step:a,caption:n?"deseada":"mantenimiento"}}const n=t[e.climate],{min:i,max:o,step:s}=Mt(n?.attributes??{});return{kind:"climate",entity:e.climate,value:wt(n?.attributes.temperature),min:i,max:o,step:s,caption:null}}function Zt(t,e){if(!Ft(t,e)||!qt(t,e))return null;const n=e.maintenance,i=t[n],{min:o,max:s,step:r}=Vt(i?.attributes??{});return{entity:n,value:Et(i),min:o,max:s,step:r}}const Gt=[{name:"name",selector:{text:{}}},{name:"climate",required:!0,selector:{entity:{domain:"climate"}}},{name:"bubbles",selector:{entity:{domain:"switch"}}},{name:"heater",selector:{entity:{domain:"binary_sensor"}}},{name:"ready",selector:{entity:{domain:"binary_sensor"}}},{name:"time_to_ready",selector:{entity:{domain:"sensor"}}},{name:"ambient",selector:{entity:{domain:["number","sensor"]}}},{name:"error",selector:{entity:{domain:"sensor"}}},{name:"connection",selector:{entity:{domain:"binary_sensor"}}},{name:"power_switch",selector:{entity:{domain:"switch"}}},{name:"power",selector:{entity:{domain:"sensor"}}},{name:"energy_today",selector:{entity:{domain:"sensor"}}},{name:"usage",selector:{entity:{domain:"input_select"}}},{name:"desired",selector:{entity:{domain:"input_number"}}},{name:"maintenance",selector:{entity:{domain:"input_number"}}},{name:"plan",selector:{entity:{domain:"sensor"}}},{name:"planner",selector:{entity:{domain:"input_boolean"}}},{name:"observe",selector:{entity:{domain:"input_boolean"}}},{name:"grid_extra",selector:{entity:{domain:"sensor"}}}],Yt={name:"Nombre",climate:"Termostato del jacuzzi (climate)",bubbles:"Burbujas (switch)",heater:"Resistencia calentando (binary_sensor)",ready:"Agua lista (binary_sensor)",time_to_ready:"Tiempo hasta listo, en horas (sensor)",ambient:"Temperatura ambiente",error:"Código de error de la bomba (sensor)",connection:"Placa WiFi conectada (binary_sensor)",power_switch:"Enchufe del jacuzzi, solo lectura (switch)",power:"Potencia real en W (sensor)",energy_today:"Energía de hoy (sensor)",usage:"Planificador: uso No/Hoy/Siempre (input_select)",desired:"Planificador: temperatura deseada (input_number)",maintenance:"Planificador: temperatura de mantenimiento (input_number)",plan:"Planificador: plan en JSON (sensor)",planner:"Planificador: encendido (input_boolean)",observe:"Planificador: modo observar (input_boolean)",grid_extra:"Importación extra de red en W (sensor)"};let Kt=class extends lt{constructor(){super(...arguments),this._computeLabel=t=>Yt[t.name]??t.name}setConfig(t){this._config=t}render(){return this.hass&&this._config?F`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Gt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p class="hint">Solo el termostato es obligatorio; lo que falte se oculta en la tarjeta. Con el planificador encendido, el dial edita la temperatura deseada o la de mantenimiento.</p>
    `:J}_valueChanged(t){bt(this,"config-changed",{config:t.detail.value})}};Kt.styles=r`
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85em;
      margin-top: 8px;
    }
  `,t([mt({attribute:!1})],Kt.prototype,"hass",void 0),t([ft()],Kt.prototype,"_config",void 0),Kt=t([ht(vt)],Kt),console.info("%c LAY-Z-SPA-CARD %c v0.2.1 ","color: white; background: #ff8100; font-weight: 700;","color: #ff8100; background: #1c1c1c; font-weight: 700;"),window.customCards=window.customCards||[],window.customCards.push({type:yt,name:"Lay-Z-Spa Card",description:"Gestión del jacuzzi: temperatura, modos, burbujas, tiempo hasta listo y consumo",preview:!0});const Xt="#6f7176",Qt={off:{icon:"mdi:power",label:"Apagado",color:Xt,dot:"#4a4b4f"},fan_only:{icon:"mdi:fan",label:"Filtro",color:"#2b9af9",dot:"#15578f"},heat:{icon:"mdi:fire",label:"Calor",color:"#ff8100",dot:"#9c4e00"}},te=["off","fan_only","heat"];let ee=class extends lt{constructor(){super(...arguments),this._dragging=!1,this._dragTemp=null,this._pending=null,this._pendingEntity=null,this._valueAngle=0,this._dragPointerId=null,this._boundMove=t=>this._onPointerMove(t),this._boundUp=t=>this._onPointerUp(t),this._toggleBubbles=()=>{this.config.bubbles&&this.hass.callService("switch","toggle",{entity_id:this.config.bubbles})},this._togglePlanner=()=>{this.config.planner&&this.hass.callService("input_boolean","toggle",{entity_id:this.config.planner})}}static async getConfigElement(){return document.createElement(vt)}static getStubConfig(t){return{name:"Jacuzzi",...Bt(t?Object.keys(t.states):[])}}setConfig(t){if(!t.climate)throw new Error("Falta 'climate'");this.config={...t}}getCardSize(){return 6}disconnectedCallback(){super.disconnectedCallback(),this._removeWindowListeners()}get _states(){return this.hass.states}render(){if(!this.hass||!this.config)return J;const t=this._states,e=t[this.config.climate];if(!e)return F`<ha-card><div class="warn">Entidad no encontrada: ${this.config.climate}</div></ha-card>`;const n=kt(t,this.config),i="ok"===n,o=e.state,s=Qt[o],r=i&&s?s.color:Xt,a=i&&s?s.dot:"#4a4b4f",c=Jt(t,this.config),{min:l,max:d}=c,h=jt(this._pendingFor(c.entity),c.value,Date.now()),p=function(t,e,n){return t??e??n}(this._dragTemp,h,c.value),u=i?wt(e.attributes.current_temperature):null,m=i&&!!this.config.heater&&"on"===t[this.config.heater]?.state,f=null!==p,g=Ht(p??l,l,d);this._valueAngle=f?g%360:-999;const _=It(100,100,Tt,g),b=null!==u?Ht(u,l,d):null,y=null!==b?It(100,100,Tt,b):null,v=null!==b?Math.min(g,b):Ot,$=null!==b?Math.max(g,b):g,x=`grad-${o}`,w=s?"heat"===o&&m?"Calentando":s.label:o,A=Et(this.config.power?t[this.config.power]:void 0),E=function(t,e){const n=e.planner?t[e.planner]:void 0;return e.planner&&At(n)?{entity:e.planner,on:"on"===n.state}:null}(t,this.config);return F`
      <ha-card style="--accent:${r}">
        <div class="header">
          <span class="title"><ha-icon icon="mdi:hot-tub"></ha-icon>${this.config.name??"Jacuzzi"}</span>
          <span class="header-center">
            ${E?F`<button
                  class="planner-toggle ${E.on?"on":""}"
                  title=${E.on?"Planificador encendido: tócalo para apagarlo":"Planificador apagado: tócalo para encenderlo"}
                  @click=${this._togglePlanner}
                >
                  <ha-icon icon=${E.on?"mdi:robot":"mdi:robot-off"}></ha-icon>Planificador
                </button>`:J}
          </span>
          <span class="header-right">
          ${null!==A?F`<button
                class="power"
                title="Consumo real"
                @click=${()=>this._openMoreInfo(this.config.energy_today||this.config.power)}
              >
                <ha-icon icon="mdi:flash"></ha-icon>${Ct(A)} W
              </button>`:J}
          </span>
        </div>

        <div class="dial-wrap">
          <svg viewBox="0 0 200 200" class="dial" @pointerdown=${this._onPointerDown}>
            <defs>
              <linearGradient id=${x} x1="0" y1="0" x2="1" y2="1">
                ${"fan_only"===o?q`<stop offset="0%" stop-color="#5cc6ff" /><stop offset="100%" stop-color="#1f7fd6" />`:"heat"===o?q`<stop offset="0%" stop-color="#ffb454" /><stop offset="100%" stop-color="#e8730a" />`:q`<stop offset="0%" stop-color="#8a8c91" /><stop offset="100%" stop-color="#5d5f63" />`}
              </linearGradient>
            </defs>
            <path class="track" d=${Nt(100,100,Tt,Ot,510)} />
            ${i&&f?q`
                <path class="glow" style="stroke:${r}" d=${Nt(100,100,Tt,v,$)} />
                <path class="value" style="stroke:url(#${x})" d=${Nt(100,100,Tt,v,$)} />
                ${y?q`<circle class="curdot" style="fill:${a}" cx=${y.x} cy=${y.y} r="4" />`:J}
                <circle class="handle ${m?"pulse":""}" style="stroke:${r}" cx=${_.x} cy=${_.y} r="8" />`:J}
          </svg>
          <div class="dial-center">${i?this._renderCenter(w,p,u,c.caption):this._renderUnavailable(n)}</div>
        </div>

        ${i?this._renderInfo():J} ${i?this._renderPlanner():J}
        ${this._renderModes(i,o,e.attributes.hvac_modes)}
      </ha-card>
    `}_renderCenter(t,e,n,i){return F`
      <div class="center-tap clickable" title="Ver detalle" @click=${()=>this._openMoreInfo(this.config.climate)}>
        <div class="mode-name">${t}</div>
        <div class="target">
          <span class="int">${null!==e?Math.round(e):"--"}</span><span class="unit">°C</span>
        </div>
        ${i?F`<div class="caption">${i}</div>`:J}
      </div>
      ${null!==n?F`<div class="current clickable" title="Ver histórico" @click=${()=>this._openMoreInfo(this.config.climate)}>
            <ha-icon icon="mdi:water-thermometer"></ha-icon>${Ut(n)} °C
          </div>`:J}
      <div class="adjust">
        <button class="round" @click=${()=>this._step(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
        <button class="round" @click=${()=>this._step(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>
    `}_renderUnavailable(t){const e=Pt[t];return F`
      <ha-icon class="unavail-icon" icon=${e.icon}></ha-icon>
      <div class="unavail-title">${e.title}</div>
      <div class="unavail-detail">${e.detail}</div>
    `}_renderInfo(){const t=this._states,e=Et(this.config.ambient?t[this.config.ambient]:void 0),n=t[this.config.climate],i=n?wt(n.attributes.current_temperature):null,o=function(t,e,n){return"helper"!==e.kind||"ready"!==t.kind?t:null===n||null===e.value||n<e.value?{kind:"none"}:t}(function(t,e){const n=t[e.climate];if(!n||"heat"!==n.state)return{kind:"none"};const i=St(t,e.ready);if(At(i)){if("on"===i.state)return{kind:"ready"}}else{const t=wt(n.attributes.current_temperature),e=wt(n.attributes.temperature);if(null!==t&&null!==e&&t>=e)return{kind:"ready"}}const o=Et(St(t,e.time_to_ready));return null===o||o<=0||o>96?{kind:"none"}:{kind:"eta",text:zt(o)}}(t,this.config),Jt(t,this.config),i),s=function(t,e){const n=Et(St(t,e.error));return null===n||0===n?null:`E${String(Math.trunc(n)).padStart(2,"0")}`}(t,this.config),r=function(t,e){const n=Et(e.grid_extra?t[e.grid_extra]:void 0);return null!==n&&n>0?n:null}(t,this.config);return F`
      <div class="info">
        ${null!==e?F`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.ambient)}>
              <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>Amb. ${Ut(e)} °C
            </span>`:J}
        ${null!==r?F`<span class="item grid-extra clickable" title="Importando de la red para el jacuzzi (sin batería)" @click=${()=>this._openMoreInfo(this.config.grid_extra)}>
              <ha-icon icon="mdi:transmission-tower-import"></ha-icon>+${Ct(r)} W red
            </span>`:J}
        ${"ready"===o.kind?F`<span class="chip ready"><ha-icon icon="mdi:check-circle"></ha-icon>Listo</span>`:"eta"===o.kind?F`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.time_to_ready)}>
              <ha-icon icon="mdi:timer-sand"></ha-icon>Listo en ${o.text}
            </span>`:J}
      </div>
      ${s?F`<div class="warnings"><span class="chip error"><ha-icon icon="mdi:alert"></ha-icon>Error ${s}</span></div>`:J}
    `}_renderModes(t,e,n){const i=Array.isArray(n)?n:te,o=function(t,e){if(!e.bubbles)return"none";const n=t[e.bubbles];return At(n)?"on"===n.state?"on":"off":"unavailable"}(this._states,this.config);return F`
      <div class="bar">
        <div class="modes">
          ${te.filter(t=>i.includes(t)).map(n=>{const i=Qt[n];return F`<button
              class="mode ${t&&e===n?"active":""}"
              style="--mode-color:${i.color}"
              title=${i.label}
              ?disabled=${!t}
              @click=${()=>this._setMode(n)}
            >
              <ha-icon icon=${i.icon}></ha-icon>
            </button>`})}
        </div>
        ${"none"!==o?F`<button
              class="bubbles ${t&&"on"===o?"active":""}"
              title=${"unavailable"===o?"Burbujas sin datos":"Burbujas"}
              ?disabled=${!t||"unavailable"===o}
              @click=${this._toggleBubbles}
            >
              <ha-icon icon="mdi:chart-bubble"></ha-icon>
            </button>`:J}
      </div>
    `}_setMode(t){this.hass.callService("climate","set_hvac_mode",{entity_id:this.config.climate,hvac_mode:t})}_pendingFor(t){return this._pendingEntity===t?this._pending:null}_step(t){const e=Jt(this._states,this.config),{min:n,max:i,step:o}=e,s=jt(this._pendingFor(e.entity),e.value,Date.now())??e.value??n,r=Rt(s+t*o,n,i,o);r!==s&&this._sendTarget(r)}_sendTarget(t){const e=Jt(this._states,this.config);this._pending={value:t,at:Date.now()},this._pendingEntity=e.entity;const n=function(t,e){return"helper"===t.kind?{domain:"input_number",service:"set_value",data:{entity_id:t.entity,value:e}}:{domain:"climate",service:"set_temperature",data:{entity_id:t.entity,temperature:e}}}(e,t);this.hass.callService(n.domain,n.service,n.data)}_renderPlanner(){const t=this._states,e=function(t,e){if(!e.plan||!Ft(t,e))return null;const n=t[e.plan]?.state??"";if(!n.startsWith("{"))return null;let i;try{i=JSON.parse(n)}catch{return null}return{text:String(i.m??""),heating:"calentar"===i.a,grid:!0===i.r,observing:!!e.observe&&"on"===t[e.observe]?.state,rule:Number(i.n??-1)}}(t,this.config),n=function(t,e){if(!Ft(t,e))return null;const n=e.usage?t[e.usage]:void 0;if(!At(n))return null;const i=Array.isArray(n.attributes.options)?n.attributes.options.map(String):[];return{current:n.state,options:i}}(t,this.config),i=Zt(t,this.config);return e||n||i?F`
      ${e?F`<div class="plan ${e.observing?"observing":""} clickable" title="Plan del jacuzzi" @click=${()=>this._openMoreInfo(this.config.plan)}>
            <ha-icon icon=${e.observing?"mdi:eye":"mdi:robot"}></ha-icon>
            <span>${e.observing?"Observando: ":""}${e.text}${e.grid?" · red":""}</span>
          </div>`:J}
      ${n?F`<div class="usage">
            ${n.options.map(t=>F`<button class="${t===n.current?"active":""}" @click=${()=>this._setUsage(t)}>${t}</button>`)}
          </div>`:J}
      ${i?F`<div class="maint">
            <span>Mantenimiento</span>
            <button class="round sm" @click=${()=>this._stepMaintenance(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
            <span class="maint-value">${null!==i.value?Ut(i.value):"--"} °C</span>
            <button class="round sm" @click=${()=>this._stepMaintenance(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
          </div>`:J}
    `:J}_setUsage(t){this.config.usage&&this.hass.callService("input_select","select_option",{entity_id:this.config.usage,option:t})}_stepMaintenance(t){const e=Zt(this._states,this.config);if(!e||null===e.value)return;const n=Rt(e.value+t*e.step,e.min,e.max,e.step);n!==e.value&&this.hass.callService("input_number","set_value",{entity_id:e.entity,value:n})}_openMoreInfo(t){t&&this.hass?.states[t]&&bt(this,"hass-more-info",{entityId:t})}_svg(){return this.renderRoot.querySelector("svg.dial")}_onPointerDown(t){if("ok"!==kt(this._states,this.config))return;const e=this._svg();if(!e)return;const n=e.getBoundingClientRect();if(!n.width)return;if(function(t,e,n,i){const o=Math.hypot(t,e);if(Math.abs(o-Tt*n)>21*n)return!1;let s=Math.abs(Dt(t,e)-i);return s>180&&(s=360-s),s<=22}(t.clientX-(n.left+n.width/2),t.clientY-(n.top+n.height/2),n.width/200,this._valueAngle)){t.preventDefault(),this._dragging=!0,this._dragPointerId=t.pointerId;try{e.setPointerCapture(t.pointerId)}catch(t){}window.addEventListener("pointermove",this._boundMove),window.addEventListener("pointerup",this._boundUp),window.addEventListener("pointercancel",this._boundUp)}}_onPointerMove(t){if(!this._dragging||t.pointerId!==this._dragPointerId)return;t.cancelable&&t.preventDefault();const e=this._svg();if(!e)return;const n=e.getBoundingClientRect(),i=Dt(t.clientX-(n.left+n.width/2),t.clientY-(n.top+n.height/2)),{min:o,max:s,step:r}=Jt(this._states,this.config);this._dragTemp=Lt(i,o,s,r)}_onPointerUp(t){if(!this._dragging||t.pointerId!==this._dragPointerId)return;if(this._dragging=!1,this._removeWindowListeners(),null!==this._dragPointerId){try{this._svg()?.releasePointerCapture(this._dragPointerId)}catch(t){}this._dragPointerId=null}const e=Jt(this._states,this.config),n=jt(this._pendingFor(e.entity),e.value,Date.now())??e.value,i=function(t,e,n){return n&&null!==t&&t!==e?t:null}(this._dragTemp,n,"ok"===kt(this._states,this.config));null!==i&&this._sendTarget(i),this._dragTemp=null}_removeWindowListeners(){window.removeEventListener("pointermove",this._boundMove),window.removeEventListener("pointerup",this._boundUp),window.removeEventListener("pointercancel",this._boundUp)}};ee.styles=r`
    ha-card {
      padding: 12px 12px 16px;
      color: var(--primary-text-color);
    }
    .warn {
      padding: 16px;
      color: var(--error-color, #db4437);
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px 0;
    }
    .title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 1.05rem;
      font-weight: 500;
      color: var(--secondary-text-color);
    }
    .title ha-icon {
      --mdc-icon-size: 20px;
    }
    button.power {
      display: flex;
      align-items: center;
      gap: 2px;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      font-size: 0.9rem;
      cursor: pointer;
      font-variant-numeric: tabular-nums;
    }
    button.power ha-icon {
      --mdc-icon-size: 16px;
    }

    .dial-wrap {
      position: relative;
      width: 100%;
      max-width: 300px;
      margin: 4px auto 0;
      aspect-ratio: 1 / 1;
    }
    .dial {
      width: 100%;
      height: 100%;
      touch-action: none;
    }
    .track {
      fill: none;
      stroke: var(--divider-color, #38393d);
      stroke-width: 18;
      stroke-linecap: round;
    }
    .glow {
      fill: none;
      stroke-width: 18;
      stroke-linecap: round;
      opacity: 0.45;
      filter: blur(6px);
    }
    .value {
      fill: none;
      stroke-width: 18;
      stroke-linecap: round;
    }
    .handle {
      fill: #fff;
      stroke-width: 3;
      cursor: grab;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.5));
    }
    .handle.pulse {
      animation: pulse 1.6s ease-in-out infinite;
    }
    @keyframes pulse {
      0%,
      100% {
        stroke-width: 3;
      }
      50% {
        stroke-width: 6;
      }
    }
    .dial-center {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      pointer-events: none;
      text-align: center;
      padding: 0 22%;
    }
    .center-tap {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .mode-name {
      font-size: 1.05rem;
      color: var(--accent);
      font-weight: 600;
    }
    .target {
      display: flex;
      align-items: flex-start;
      line-height: 1;
    }
    .target .int {
      font-size: 3.6rem;
      font-weight: 300;
      letter-spacing: -1px;
    }
    .target .unit {
      font-size: 1.05rem;
      color: var(--secondary-text-color);
      margin-top: 8px;
      margin-left: 2px;
    }
    .current {
      font-size: 0.95rem;
      color: var(--accent);
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .current ha-icon,
    .item ha-icon,
    .chip ha-icon {
      --mdc-icon-size: 16px;
    }
    .clickable {
      cursor: pointer;
      pointer-events: auto;
    }
    .adjust {
      display: flex;
      gap: 24px;
      margin-top: 8px;
      pointer-events: auto;
    }
    button.round {
      border: 2px solid var(--divider-color, #46494d);
      border-radius: 50%;
      width: 44px;
      height: 44px;
      cursor: pointer;
      background: transparent;
      color: var(--primary-text-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .unavail-icon {
      --mdc-icon-size: 36px;
      color: var(--secondary-text-color);
    }
    .unavail-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .unavail-detail {
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }

    .info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 14px;
      margin-top: 4px;
      font-size: 0.92rem;
      color: var(--secondary-text-color);
    }
    .item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }
    .warnings {
      display: flex;
      justify-content: center;
      margin-top: 6px;
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.85rem;
      padding: 2px 10px;
      border-radius: 12px;
      color: #fff;
    }
    .chip.ready {
      background: #43a047;
    }
    .chip.error {
      background: var(--error-color, #db4437);
    }

    .bar {
      display: flex;
      gap: 8px;
      margin-top: 10px;
    }
    .modes {
      flex: 1;
      display: flex;
      gap: 6px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 14px;
      padding: 4px;
    }
    .mode,
    .bubbles {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 8px;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .bubbles {
      flex: 0 0 56px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 14px;
    }
    .mode.active {
      background: var(--mode-color);
      color: #fff;
    }
    .bubbles.active {
      background: #26a69a;
      color: #fff;
    }
    .mode:disabled,
    .bubbles:disabled {
      opacity: 0.35;
      cursor: default;
    }

    /* PLANIFICADOR (v0.2.0) */
    /* Cabecera en tres columnas: nombre | botón del planificador centrado | potencia (v0.2.1) */
    .header {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      gap: 6px;
    }
    .title {
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .header-center {
      display: flex;
      justify-content: center;
    }
    .header-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      gap: 4px;
    }
    button.planner-toggle {
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid var(--divider-color, #46494d);
      border-radius: 14px;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 2px 10px;
      font-size: 0.8rem;
      cursor: pointer;
    }
    button.planner-toggle ha-icon {
      --mdc-icon-size: 16px;
    }
    button.planner-toggle.on {
      border-color: transparent;
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .grid-extra {
      color: #26a69a;
    }
    button.power {
      white-space: nowrap;
    }
    .caption {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      margin-top: -2px;
    }
    .plan {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
      font-size: 0.88rem;
      color: var(--primary-text-color);
      text-align: center;
    }
    .plan ha-icon {
      --mdc-icon-size: 16px;
      color: var(--accent);
      flex: 0 0 auto;
    }
    .plan.observing {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    .plan.observing ha-icon {
      color: var(--secondary-text-color);
    }
    .usage {
      display: flex;
      gap: 4px;
      margin-top: 8px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 12px;
      padding: 3px;
    }
    .usage button {
      flex: 1;
      border: none;
      background: transparent;
      color: var(--secondary-text-color);
      padding: 6px 4px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .usage button.active {
      background: var(--primary-color, #03a9f4);
      color: #fff;
    }
    .maint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .maint-value {
      min-width: 48px;
      text-align: center;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    button.round.sm {
      width: 28px;
      height: 28px;
      border-width: 1px;
    }
    button.round.sm ha-icon {
      --mdc-icon-size: 16px;
    }
  `,t([mt({attribute:!1})],ee.prototype,"hass",void 0),t([ft()],ee.prototype,"config",void 0),t([ft()],ee.prototype,"_dragging",void 0),t([ft()],ee.prototype,"_dragTemp",void 0),t([ft()],ee.prototype,"_pending",void 0),t([ft()],ee.prototype,"_pendingEntity",void 0),ee=t([ht(yt)],ee);export{ee as LayZSpaCard};
