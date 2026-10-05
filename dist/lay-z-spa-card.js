function t(t,e,i,n){var s,o=arguments.length,r=o<3?e:null===n?n=Object.getOwnPropertyDescriptor(e,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,n);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(o<3?s(r):o>3?s(e,i,r):s(e,i))||r);return o>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),s=new WeakMap;let o=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,n)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[n+1],t[0]);return new o(i,t,n)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new o("string"==typeof t?t:t+"",void 0,n))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:h,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,f=globalThis,m=f.trustedTypes,_=m?m.emptyScript:"",g=f.reactiveElementPolyfillSupport,b=(t,e)=>t,$={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!c(t,e),v={attribute:!0,type:String,converter:$,reflect:!1,useDefault:!1,hasChanged:y};Symbol.metadata??=Symbol("metadata"),f.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(t,i,e);void 0!==n&&l(this.prototype,t,n)}}static getPropertyDescriptor(t,e,i){const{get:n,set:s}=h(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:n,set(e){const o=n?.call(this);s?.call(this,e),this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,n)=>{if(i)t.adoptedStyleSheets=n.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of n){const n=document.createElement("style"),s=e.litNonce;void 0!==s&&n.setAttribute("nonce",s),n.textContent=i.cssText,t.appendChild(n)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(void 0!==n&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:$).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(n):this.setAttribute(n,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,n=i._$Eh.get(t);if(void 0!==n&&this._$Em!==n){const t=i.getPropertyOptions(n),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:$;this._$Em=n;const o=s.fromAttribute(e,t.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(t,e,i,n=!1,s){if(void 0!==t){const o=this.constructor;if(!1===n&&(s=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??y)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(o._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:n,wrapped:s},o){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,o??e??this[t]),!0!==s||void 0!==o)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===n&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,n=this[e];!0!==t||this._$AL.has(e)||void 0===n||this.C(e,void 0,i,n)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[b("elementProperties")]=new Map,w[b("finalized")]=new Map,g?.({ReactiveElement:w}),(f.reactiveElementVersions??=[]).push("2.1.2");const x=globalThis,A=t=>t,E=x.trustedTypes,S=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,C="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,M=`<${P}>`,z=document,U=()=>z.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,O=Array.isArray,j="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,N=/-->/g,I=/>/g,H=RegExp(`>|${j}(?:([^\\s"'>=/]+)(${j}*=${j}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,W=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),q=W(1),V=W(2),F=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),Z=new WeakMap,G=z.createTreeWalker(z,129);function Y(t,e){if(!O(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const K=(t,e)=>{const i=t.length-1,n=[];let s,o=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,h=0;for(;h<i.length&&(r.lastIndex=h,c=r.exec(i),null!==c);)h=r.lastIndex,r===R?"!--"===c[1]?r=N:void 0!==c[1]?r=I:void 0!==c[2]?(B.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=H):void 0!==c[3]&&(r=H):r===H?">"===c[0]?(r=s??R,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?H:'"'===c[3]?D:L):r===D||r===L?r=H:r===N||r===I?r=R:(r=H,s=void 0);const d=r===H&&t[e+1].startsWith("/>")?" ":"";o+=r===R?i+M:l>=0?(n.push(a),i.slice(0,l)+C+i.slice(l)+k+d):i+k+(-2===l?e:d)}return[Y(t,o+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]};class X{constructor({strings:t,_$litType$:e},i){let n;this.parts=[];let s=0,o=0;const r=t.length-1,a=this.parts,[c,l]=K(t,e);if(this.el=X.createElement(c,i),G.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(n=G.nextNode())&&a.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const t of n.getAttributeNames())if(t.endsWith(C)){const e=l[o++],i=n.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?nt:"?"===r[1]?st:"@"===r[1]?ot:it}),n.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:s}),n.removeAttribute(t));if(B.test(n.tagName)){const t=n.textContent.split(k),e=t.length-1;if(e>0){n.textContent=E?E.emptyScript:"";for(let i=0;i<e;i++)n.append(t[i],U()),G.nextNode(),a.push({type:2,index:++s});n.append(t[e],U())}}}else if(8===n.nodeType)if(n.data===P)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=n.data.indexOf(k,t+1));)a.push({type:7,index:s}),t+=k.length-1}s++}}static createElement(t,e){const i=z.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,n){if(e===F)return e;let s=void 0!==n?i._$Co?.[n]:i._$Cl;const o=T(e)?void 0:e._$litDirective$;return s?.constructor!==o&&(s?._$AO?.(!1),void 0===o?s=void 0:(s=new o(t),s._$AT(t,i,n)),void 0!==n?(i._$Co??=[])[n]=s:i._$Cl=s),void 0!==s&&(e=Q(t,s._$AS(t,e.values),s,n)),e}class tt{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,n=(t?.creationScope??z).importNode(e,!0);G.currentNode=n;let s=G.nextNode(),o=0,r=0,a=i[0];for(;void 0!==a;){if(o===a.index){let e;2===a.type?e=new et(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new rt(s,this,t)),this._$AV.push(e),a=i[++r]}o!==a?.index&&(s=G.nextNode(),o++)}return G.currentNode=z,n}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class et{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,n){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),T(t)?t===J||null==t||""===t?(this._$AH!==J&&this._$AR(),this._$AH=J):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>O(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==J&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,n="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=X.createElement(Y(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(e);else{const t=new tt(n,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=Z.get(t.strings);return void 0===e&&Z.set(t.strings,e=new X(t)),e}k(t){O(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,n=0;for(const s of t)n===e.length?e.push(i=new et(this.O(U()),this.O(U()),this,this.options)):i=e[n],i._$AI(s),n++;n<e.length&&(this._$AR(i&&i._$AB.nextSibling,n),e.length=n)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=A(t).nextSibling;A(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class it{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,n,s){this.type=1,this._$AH=J,this._$AN=void 0,this.element=t,this.name=e,this._$AM=n,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}_$AI(t,e=this,i,n){const s=this.strings;let o=!1;if(void 0===s)t=Q(this,t,e,0),o=!T(t)||t!==this._$AH&&t!==F,o&&(this._$AH=t);else{const n=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=Q(this,n[i+r],e,r),a===F&&(a=this._$AH[r]),o||=!T(a)||a!==this._$AH[r],a===J?t=J:t!==J&&(t+=(a??"")+s[r+1]),this._$AH[r]=a}o&&!n&&this.j(t)}j(t){t===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class nt extends it{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===J?void 0:t}}class st extends it{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==J)}}class ot extends it{constructor(t,e,i,n,s){super(t,e,i,n,s),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??J)===F)return;const i=this._$AH,n=t===J&&i!==J||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==J&&(i===J||n);n&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class rt{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const at=x.litHtmlPolyfillSupport;at?.(X,et),(x.litHtmlVersions??=[]).push("3.3.3");const ct=globalThis;class lt extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const n=i?.renderBefore??e;let s=n._$litPart$;if(void 0===s){const t=i?.renderBefore??null;n._$litPart$=s=new et(e.insertBefore(U(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}}lt._$litElement$=!0,lt.finalized=!0,ct.litElementHydrateSupport?.({LitElement:lt});const ht=ct.litElementPolyfillSupport;ht?.({LitElement:lt}),(ct.litElementVersions??=[]).push("4.2.2");const dt=t=>(e,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},pt={attribute:!0,type:String,converter:$,reflect:!1,hasChanged:y},ut=(t=pt,e,i)=>{const{kind:n,metadata:s}=i;let o=globalThis.litPropertyMetadata.get(s);if(void 0===o&&globalThis.litPropertyMetadata.set(s,o=new Map),"setter"===n&&((t=Object.create(t)).wrapped=!0),o.set(i.name,t),"accessor"===n){const{name:n}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(n,s,t,!0,i)},init(e){return void 0!==e&&this.C(n,void 0,t,e),e}}}if("setter"===n){const{name:n}=i;return function(i){const s=this[n];e.call(this,i),this.requestUpdate(n,s,t,!0,i)}}throw Error("Unsupported decorator location: "+n)};function ft(t){return(e,i)=>"object"==typeof i?ut(t,e,i):((t,e,i)=>{const n=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),n?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function mt(t){return ft({...t,state:!0,attribute:!1})}var _t,gt;!function(t){t.language="language",t.system="system",t.comma_decimal="comma_decimal",t.decimal_comma="decimal_comma",t.space_comma="space_comma",t.none="none"}(_t||(_t={})),function(t){t.language="language",t.system="system",t.am_pm="12",t.twenty_four="24"}(gt||(gt={}));var bt=function(t,e,i,n){n=n||{},i=null==i?{}:i;var s=new Event(e,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return s.detail=i,t.dispatchEvent(s),s};const $t="lay-z-spa-card",yt="lay-z-spa-card-editor",vt={climate:"climate.layzspa_temperature_control",bubbles:"switch.layzspa_airbubbles",heater:"binary_sensor.layzspa_heater",ready:"binary_sensor.layzspa_ready",time_to_ready:"sensor.layzspa_time_to_ready",ambient:"number.layzspa_amb_temp_c",error:"sensor.layzspa_error",connection:"binary_sensor.layzspa_connection",power_switch:"switch.jacuzzi",power:"sensor.jacuzzi_power",energy_today:"sensor.jacuzzi_energia_energy_daily"},wt=new Set(["unavailable","unknown"]);function xt(t){if(null==t||""===t)return null;const e=Number(t);return Number.isFinite(e)?e:null}function At(t){return!!t&&!wt.has(t.state)}function Et(t){return At(t)?xt(t.state):null}function St(t,e){return e?t[e]:void 0}function Ct(t,e){if("off"===St(t,e.power_switch)?.state)return"no_power";const i=St(t,e.connection);if(!!e.connection&&"on"!==i?.state){const i=Et(St(t,e.power));return null!==i&&i<1?"rcd_tripped":"board_offline"}return At(t[e.climate])?"ok":"board_offline"}const kt={no_power:{icon:"mdi:power-plug-off",title:"Sin corriente",detail:"Enchufe del jacuzzi apagado"},rcd_tripped:{icon:"mdi:flash-alert",title:"Sin corriente en la bomba",detail:"Rearma el diferencial del cable del jacuzzi"},board_offline:{icon:"mdi:wifi-off",title:"Placa WiFi sin conexión",detail:"La bomba tiene corriente pero la placa no responde"}};function Pt(t){const e=Math.round(60*t);if(e<1)return"<1 min";const i=Math.floor(e/60),n=e%60;return 0===i?`${n} min`:0===n?`${i} h`:`${i} h ${n} min`}function Mt(t){let e=xt(t.min_temp)??20,i=xt(t.max_temp)??40;e>=i&&(e=20,i=40);const n=xt(t.target_temp_step);return{min:e,max:i,step:null!==n&&n>0?n:1}}function zt(t,e,i){return t?null!==e&&e===t.value||i-t.at>1e4?null:t.value:null}function Ut(t){const e=Math.round(10*t)/10;return(Number.isInteger(e)?String(e):e.toFixed(1)).replace(".",",")}const Tt=210,Ot=80;function jt(t,e,i,n){const s=(n-90)*Math.PI/180;return{x:t+i*Math.cos(s),y:e+i*Math.sin(s)}}function Rt(t,e,i,n,s){const o=jt(t,e,i,s),r=jt(t,e,i,n),a=s-n<=180?"0":"1";return`M ${o.x} ${o.y} A ${i} ${i} 0 ${a} 0 ${r.x} ${r.y}`}function Nt(t,e,i,n){const s=Math.round(t/n)*n;return Number(Math.min(i,Math.max(e,s)).toFixed(2))}function It(t,e,i){const n=Math.min(1,Math.max(0,(t-e)/(i-e)));return Tt+300*n}function Ht(t,e,i,n){return Nt(e+function(t){let e;return e=t>=Tt?(t-Tt)/300:t<=150?(t+360-Tt)/300:t-150<Tt-t?1:0,Math.min(1,Math.max(0,e))}(t)*(i-e),e,i,n)}function Lt(t,e){let i=180*Math.atan2(e,t)/Math.PI+90;return i<0&&(i+=360),i}function Dt(t){const e=new Set(t),i={};for(const[t,n]of Object.entries(vt))e.has(n)&&(i[t]=n);const n=i.climate??t.find(t=>t.startsWith("climate.")&&t.includes("layzspa"))??vt.climate;return{...i,climate:n}}const Bt=[{name:"name",selector:{text:{}}},{name:"climate",required:!0,selector:{entity:{domain:"climate"}}},{name:"bubbles",selector:{entity:{domain:"switch"}}},{name:"heater",selector:{entity:{domain:"binary_sensor"}}},{name:"ready",selector:{entity:{domain:"binary_sensor"}}},{name:"time_to_ready",selector:{entity:{domain:"sensor"}}},{name:"ambient",selector:{entity:{domain:["number","sensor"]}}},{name:"error",selector:{entity:{domain:"sensor"}}},{name:"connection",selector:{entity:{domain:"binary_sensor"}}},{name:"power_switch",selector:{entity:{domain:"switch"}}},{name:"power",selector:{entity:{domain:"sensor"}}},{name:"energy_today",selector:{entity:{domain:"sensor"}}}],Wt={name:"Nombre",climate:"Termostato del jacuzzi (climate)",bubbles:"Burbujas (switch)",heater:"Resistencia calentando (binary_sensor)",ready:"Agua lista (binary_sensor)",time_to_ready:"Tiempo hasta listo, en horas (sensor)",ambient:"Temperatura ambiente",error:"Código de error de la bomba (sensor)",connection:"Placa WiFi conectada (binary_sensor)",power_switch:"Enchufe del jacuzzi, solo lectura (switch)",power:"Potencia real en W (sensor)",energy_today:"Energía de hoy (sensor)"};let qt=class extends lt{constructor(){super(...arguments),this._computeLabel=t=>Wt[t.name]??t.name}setConfig(t){this._config=t}render(){return this.hass&&this._config?q`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${Bt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p class="hint">Solo el termostato es obligatorio; lo que falte se oculta en la tarjeta.</p>
    `:J}_valueChanged(t){bt(this,"config-changed",{config:t.detail.value})}};qt.styles=r`
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85em;
      margin-top: 8px;
    }
  `,t([ft({attribute:!1})],qt.prototype,"hass",void 0),t([mt()],qt.prototype,"_config",void 0),qt=t([dt(yt)],qt),console.info("%c LAY-Z-SPA-CARD %c v0.1.1 ","color: white; background: #ff8100; font-weight: 700;","color: #ff8100; background: #1c1c1c; font-weight: 700;"),window.customCards=window.customCards||[],window.customCards.push({type:$t,name:"Lay-Z-Spa Card",description:"Gestión del jacuzzi: temperatura, modos, burbujas, tiempo hasta listo y consumo",preview:!0});const Vt="#6f7176",Ft={off:{icon:"mdi:power",label:"Apagado",color:Vt,dot:"#4a4b4f"},fan_only:{icon:"mdi:fan",label:"Filtro",color:"#2b9af9",dot:"#15578f"},heat:{icon:"mdi:fire",label:"Calor",color:"#ff8100",dot:"#9c4e00"}},Jt=["off","fan_only","heat"];let Zt=class extends lt{constructor(){super(...arguments),this._dragging=!1,this._dragTemp=null,this._pending=null,this._valueAngle=0,this._dragPointerId=null,this._boundMove=t=>this._onPointerMove(t),this._boundUp=t=>this._onPointerUp(t),this._toggleBubbles=()=>{this.config.bubbles&&this.hass.callService("switch","toggle",{entity_id:this.config.bubbles})}}static async getConfigElement(){return document.createElement(yt)}static getStubConfig(t){return{name:"Jacuzzi",...Dt(t?Object.keys(t.states):[])}}setConfig(t){if(!t.climate)throw new Error("Falta 'climate'");this.config={...t}}getCardSize(){return 6}disconnectedCallback(){super.disconnectedCallback(),this._removeWindowListeners()}get _states(){return this.hass.states}render(){if(!this.hass||!this.config)return J;const t=this._states,e=t[this.config.climate];if(!e)return q`<ha-card><div class="warn">Entidad no encontrada: ${this.config.climate}</div></ha-card>`;const i=Ct(t,this.config),n="ok"===i,s=e.state,o=Ft[s],r=n&&o?o.color:Vt,a=n&&o?o.dot:"#4a4b4f",{min:c,max:l}=Mt(e.attributes),h=xt(e.attributes.temperature),d=zt(this._pending,h,Date.now()),p=function(t,e,i){return t??e??i}(this._dragTemp,d,h),u=n?xt(e.attributes.current_temperature):null,f=n&&!!this.config.heater&&"on"===t[this.config.heater]?.state,m=null!==p,_=It(p??c,c,l);this._valueAngle=m?_%360:-999;const g=jt(100,100,Ot,_),b=null!==u?It(u,c,l):null,$=null!==b?jt(100,100,Ot,b):null,y=null!==b?Math.min(_,b):Tt,v=null!==b?Math.max(_,b):_,w=`grad-${s}`,x=o?"heat"===s&&f?"Calentando":o.label:s,A=Et(this.config.power?t[this.config.power]:void 0);return q`
      <ha-card style="--accent:${r}">
        <div class="header">
          <span class="title"><ha-icon icon="mdi:hot-tub"></ha-icon>${this.config.name??"Jacuzzi"}</span>
          ${null!==A?q`<button
                class="power"
                title="Consumo real"
                @click=${()=>this._openMoreInfo(this.config.energy_today||this.config.power)}
              >
                <ha-icon icon="mdi:flash"></ha-icon>${function(t){return String(Math.round(t)).replace(/\B(?=(\d{3})+(?!\d))/g,".")}(A)} W
              </button>`:J}
        </div>

        <div class="dial-wrap">
          <svg viewBox="0 0 200 200" class="dial" @pointerdown=${this._onPointerDown}>
            <defs>
              <linearGradient id=${w} x1="0" y1="0" x2="1" y2="1">
                ${"fan_only"===s?V`<stop offset="0%" stop-color="#5cc6ff" /><stop offset="100%" stop-color="#1f7fd6" />`:"heat"===s?V`<stop offset="0%" stop-color="#ffb454" /><stop offset="100%" stop-color="#e8730a" />`:V`<stop offset="0%" stop-color="#8a8c91" /><stop offset="100%" stop-color="#5d5f63" />`}
              </linearGradient>
            </defs>
            <path class="track" d=${Rt(100,100,Ot,Tt,510)} />
            ${n&&m?V`
                <path class="glow" style="stroke:${r}" d=${Rt(100,100,Ot,y,v)} />
                <path class="value" style="stroke:url(#${w})" d=${Rt(100,100,Ot,y,v)} />
                ${$?V`<circle class="curdot" style="fill:${a}" cx=${$.x} cy=${$.y} r="4" />`:J}
                <circle class="handle ${f?"pulse":""}" style="stroke:${r}" cx=${g.x} cy=${g.y} r="8" />`:J}
          </svg>
          <div class="dial-center">${n?this._renderCenter(x,p,u):this._renderUnavailable(i)}</div>
        </div>

        ${n?this._renderInfo():J} ${this._renderModes(n,s,e.attributes.hvac_modes)}
      </ha-card>
    `}_renderCenter(t,e,i){return q`
      <div class="center-tap clickable" title="Ver detalle" @click=${()=>this._openMoreInfo(this.config.climate)}>
        <div class="mode-name">${t}</div>
        <div class="target">
          <span class="int">${null!==e?Math.round(e):"--"}</span><span class="unit">°C</span>
        </div>
      </div>
      ${null!==i?q`<div class="current clickable" title="Ver histórico" @click=${()=>this._openMoreInfo(this.config.climate)}>
            <ha-icon icon="mdi:water-thermometer"></ha-icon>${Ut(i)} °C
          </div>`:J}
      <div class="adjust">
        <button class="round" @click=${()=>this._step(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
        <button class="round" @click=${()=>this._step(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>
    `}_renderUnavailable(t){const e=kt[t];return q`
      <ha-icon class="unavail-icon" icon=${e.icon}></ha-icon>
      <div class="unavail-title">${e.title}</div>
      <div class="unavail-detail">${e.detail}</div>
    `}_renderInfo(){const t=this._states,e=Et(this.config.ambient?t[this.config.ambient]:void 0),i=function(t,e){const i=t[e.climate];if(!i||"heat"!==i.state)return{kind:"none"};const n=St(t,e.ready);if(At(n)){if("on"===n.state)return{kind:"ready"}}else{const t=xt(i.attributes.current_temperature),e=xt(i.attributes.temperature);if(null!==t&&null!==e&&t>=e)return{kind:"ready"}}const s=Et(St(t,e.time_to_ready));return null===s||s<=0||s>96?{kind:"none"}:{kind:"eta",text:Pt(s)}}(t,this.config),n=function(t,e){const i=Et(St(t,e.error));return null===i||0===i?null:`E${String(Math.trunc(i)).padStart(2,"0")}`}(t,this.config);return q`
      <div class="info">
        ${null!==e?q`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.ambient)}>
              <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>Amb. ${Ut(e)} °C
            </span>`:J}
        ${"ready"===i.kind?q`<span class="chip ready"><ha-icon icon="mdi:check-circle"></ha-icon>Listo</span>`:"eta"===i.kind?q`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.time_to_ready)}>
              <ha-icon icon="mdi:timer-sand"></ha-icon>Listo en ${i.text}
            </span>`:J}
      </div>
      ${n?q`<div class="warnings"><span class="chip error"><ha-icon icon="mdi:alert"></ha-icon>Error ${n}</span></div>`:J}
    `}_renderModes(t,e,i){const n=Array.isArray(i)?i:Jt,s=function(t,e){if(!e.bubbles)return"none";const i=t[e.bubbles];return At(i)?"on"===i.state?"on":"off":"unavailable"}(this._states,this.config);return q`
      <div class="bar">
        <div class="modes">
          ${Jt.filter(t=>n.includes(t)).map(i=>{const n=Ft[i];return q`<button
              class="mode ${t&&e===i?"active":""}"
              style="--mode-color:${n.color}"
              title=${n.label}
              ?disabled=${!t}
              @click=${()=>this._setMode(i)}
            >
              <ha-icon icon=${n.icon}></ha-icon>
            </button>`})}
        </div>
        ${"none"!==s?q`<button
              class="bubbles ${t&&"on"===s?"active":""}"
              title=${"unavailable"===s?"Burbujas sin datos":"Burbujas"}
              ?disabled=${!t||"unavailable"===s}
              @click=${this._toggleBubbles}
            >
              <ha-icon icon="mdi:chart-bubble"></ha-icon>
            </button>`:J}
      </div>
    `}_setMode(t){this.hass.callService("climate","set_hvac_mode",{entity_id:this.config.climate,hvac_mode:t})}_step(t){const e=this._states[this.config.climate];if(!e)return;const{min:i,max:n,step:s}=Mt(e.attributes),o=xt(e.attributes.temperature),r=zt(this._pending,o,Date.now())??o??i,a=Nt(r+t*s,i,n,s);a!==r&&this._sendTarget(a)}_sendTarget(t){this._pending={value:t,at:Date.now()},this.hass.callService("climate","set_temperature",{entity_id:this.config.climate,temperature:t})}_openMoreInfo(t){t&&this.hass?.states[t]&&bt(this,"hass-more-info",{entityId:t})}_svg(){return this.renderRoot.querySelector("svg.dial")}_onPointerDown(t){if("ok"!==Ct(this._states,this.config))return;const e=this._svg();if(!e)return;const i=e.getBoundingClientRect();if(!i.width)return;if(function(t,e,i,n){const s=Math.hypot(t,e);if(Math.abs(s-Ot*i)>21*i)return!1;let o=Math.abs(Lt(t,e)-n);return o>180&&(o=360-o),o<=22}(t.clientX-(i.left+i.width/2),t.clientY-(i.top+i.height/2),i.width/200,this._valueAngle)){t.preventDefault(),this._dragging=!0,this._dragPointerId=t.pointerId;try{e.setPointerCapture(t.pointerId)}catch(t){}window.addEventListener("pointermove",this._boundMove),window.addEventListener("pointerup",this._boundUp),window.addEventListener("pointercancel",this._boundUp)}}_onPointerMove(t){if(!this._dragging||t.pointerId!==this._dragPointerId)return;t.cancelable&&t.preventDefault();const e=this._svg(),i=this._states[this.config.climate];if(!e||!i)return;const n=e.getBoundingClientRect(),s=Lt(t.clientX-(n.left+n.width/2),t.clientY-(n.top+n.height/2)),{min:o,max:r,step:a}=Mt(i.attributes);this._dragTemp=Ht(s,o,r,a)}_onPointerUp(t){if(!this._dragging||t.pointerId!==this._dragPointerId)return;if(this._dragging=!1,this._removeWindowListeners(),null!==this._dragPointerId){try{this._svg()?.releasePointerCapture(this._dragPointerId)}catch(t){}this._dragPointerId=null}const e=this._states[this.config.climate],i=e?xt(e.attributes.temperature):null,n=zt(this._pending,i,Date.now())??i,s=function(t,e,i){return i&&null!==t&&t!==e?t:null}(this._dragTemp,n,"ok"===Ct(this._states,this.config));null!==s&&this._sendTarget(s),this._dragTemp=null}_removeWindowListeners(){window.removeEventListener("pointermove",this._boundMove),window.removeEventListener("pointerup",this._boundUp),window.removeEventListener("pointercancel",this._boundUp)}};Zt.styles=r`
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
  `,t([ft({attribute:!1})],Zt.prototype,"hass",void 0),t([mt()],Zt.prototype,"config",void 0),t([mt()],Zt.prototype,"_dragging",void 0),t([mt()],Zt.prototype,"_dragTemp",void 0),t([mt()],Zt.prototype,"_pending",void 0),Zt=t([dt($t)],Zt);export{Zt as LayZSpaCard};
