function e(e,t,i,n){var a,o=arguments.length,r=o<3?t:null===n?n=Object.getOwnPropertyDescriptor(t,i):n;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(e,t,i,n);else for(var s=e.length-1;s>=0;s--)(a=e[s])&&(r=(o<3?a(r):o>3?a(t,i,r):a(t,i))||r);return o>3&&r&&Object.defineProperty(t,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const t=globalThis,i=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,n=Symbol(),a=new WeakMap;let o=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==n)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(i&&void 0===e){const i=void 0!==t&&1===t.length;i&&(e=a.get(t)),void 0===e&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&a.set(t,e))}return e}toString(){return this.cssText}};const r=(e,...t)=>{const i=1===e.length?e[0]:t.reduce((t,i,n)=>t+(e=>{if(!0===e._$cssResult$)return e.cssText;if("number"==typeof e)return e;throw Error("Value passed to 'css' function must be a 'css' function result: "+e+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+e[n+1],e[0]);return new o(i,e,n)},s=i?e=>e:e=>e instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return(e=>new o("string"==typeof e?e:e+"",void 0,n))(t)})(e):e,{is:l,defineProperty:c,getOwnPropertyDescriptor:d,getOwnPropertyNames:u,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,m=globalThis,f=m.trustedTypes,_=f?f.emptyScript:"",g=m.reactiveElementPolyfillSupport,b=(e,t)=>e,y={toAttribute(e,t){switch(t){case Boolean:e=e?_:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},v=(e,t)=>!l(e,t),$={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),m.litPropertyMetadata??=new WeakMap;let x=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=$){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),n=this.getPropertyDescriptor(e,i,t);void 0!==n&&c(this.prototype,e,n)}}static getPropertyDescriptor(e,t,i){const{get:n,set:a}=d(this.prototype,e)??{get(){return this[t]},set(e){this[t]=e}};return{get:n,set(t){const o=n?.call(this);a?.call(this,t),this.requestUpdate(e,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??$}static _$Ei(){if(this.hasOwnProperty(b("elementProperties")))return;const e=p(this);e.finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(b("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(b("properties"))){const e=this.properties,t=[...u(e),...h(e)];for(const i of t)this.createProperty(i,e[i])}const e=this[Symbol.metadata];if(null!==e){const t=litPropertyMetadata.get(e);if(void 0!==t)for(const[e,i]of t)this.elementProperties.set(e,i)}this._$Eh=new Map;for(const[e,t]of this.elementProperties){const i=this._$Eu(e,t);void 0!==i&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const e of i)t.unshift(s(e))}else void 0!==e&&t.push(s(e));return t}static _$Eu(e,t){const i=t.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((e,n)=>{if(i)e.adoptedStyleSheets=n.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const i of n){const n=document.createElement("style"),a=t.litNonce;void 0!==a&&n.setAttribute("nonce",a),n.textContent=i.cssText,e.appendChild(n)}})(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),n=this.constructor._$Eu(e,i);if(void 0!==n&&!0===i.reflect){const a=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(t,i.type);this._$Em=e,null==a?this.removeAttribute(n):this.setAttribute(n,a),this._$Em=null}}_$AK(e,t){const i=this.constructor,n=i._$Eh.get(e);if(void 0!==n&&this._$Em!==n){const e=i.getPropertyOptions(n),a="function"==typeof e.converter?{fromAttribute:e.converter}:void 0!==e.converter?.fromAttribute?e.converter:y;this._$Em=n;const o=a.fromAttribute(t,e.type);this[n]=o??this._$Ej?.get(n)??o,this._$Em=null}}requestUpdate(e,t,i,n=!1,a){if(void 0!==e){const o=this.constructor;if(!1===n&&(a=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??v)(a,t)||i.useDefault&&i.reflect&&a===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:n,wrapped:a},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),!0!==a||void 0!==o)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===n&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[e,t]of this._$Ep)this[e]=t;this._$Ep=void 0}const e=this.constructor.elementProperties;if(e.size>0)for(const[t,i]of e){const{wrapped:e}=i,n=this[t];!0!==e||this._$AL.has(t)||void 0===n||this.C(t,void 0,i,n)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(e=>e.hostUpdate?.()),this.update(t)):this._$EM()}catch(t){throw e=!1,this._$EM(),t}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(e=>this._$ET(e,this[e])),this._$EM()}updated(e){}firstUpdated(e){}};x.elementStyles=[],x.shadowRootOptions={mode:"open"},x[b("elementProperties")]=new Map,x[b("finalized")]=new Map,g?.({ReactiveElement:x}),(m.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=e=>e,A=w.trustedTypes,z=A?A.createPolicy("lit-html",{createHTML:e=>e}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,E="?"+C,P=`<${E}>`,M=document,j=()=>M.createComment(""),T=e=>null===e||"object"!=typeof e&&"function"!=typeof e,O=Array.isArray,R="[ \t\n\f\r]",U=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,L=/>/g,N=RegExp(`>|${R}(?:([^\\s"'>=/]+)(${R}*=${R}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,D=/"/g,B=/^(?:script|style|textarea|title)$/i,F=e=>(t,...i)=>({_$litType$:e,strings:t,values:i}),W=F(1),q=F(2),V=Symbol.for("lit-noChange"),J=Symbol.for("lit-nothing"),X=new WeakMap,Y=M.createTreeWalker(M,129);function Z(e,t){if(!O(e)||!e.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==z?z.createHTML(t):t}const G=(e,t)=>{const i=e.length-1,n=[];let a,o=2===t?"<svg>":3===t?"<math>":"",r=U;for(let t=0;t<i;t++){const i=e[t];let s,l,c=-1,d=0;for(;d<i.length&&(r.lastIndex=d,l=r.exec(i),null!==l);)d=r.lastIndex,r===U?"!--"===l[1]?r=H:void 0!==l[1]?r=L:void 0!==l[2]?(B.test(l[2])&&(a=RegExp("</"+l[2],"g")),r=N):void 0!==l[3]&&(r=N):r===N?">"===l[0]?(r=a??U,c=-1):void 0===l[1]?c=-2:(c=r.lastIndex-l[2].length,s=l[1],r=void 0===l[3]?N:'"'===l[3]?D:I):r===D||r===I?r=N:r===H||r===L?r=U:(r=N,a=void 0);const u=r===N&&e[t+1].startsWith("/>")?" ":"";o+=r===U?i+P:c>=0?(n.push(s),i.slice(0,c)+S+i.slice(c)+C+u):i+C+(-2===c?t:u)}return[Z(e,o+(e[i]||"<?>")+(2===t?"</svg>":3===t?"</math>":"")),n]};class K{constructor({strings:e,_$litType$:t},i){let n;this.parts=[];let a=0,o=0;const r=e.length-1,s=this.parts,[l,c]=G(e,t);if(this.el=K.createElement(l,i),Y.currentNode=this.el.content,2===t||3===t){const e=this.el.content.firstChild;e.replaceWith(...e.childNodes)}for(;null!==(n=Y.nextNode())&&s.length<r;){if(1===n.nodeType){if(n.hasAttributes())for(const e of n.getAttributeNames())if(e.endsWith(S)){const t=c[o++],i=n.getAttribute(e).split(C),r=/([.?@])?(.*)/.exec(t);s.push({type:1,index:a,name:r[2],strings:i,ctor:"."===r[1]?ne:"?"===r[1]?ae:"@"===r[1]?oe:ie}),n.removeAttribute(e)}else e.startsWith(C)&&(s.push({type:6,index:a}),n.removeAttribute(e));if(B.test(n.tagName)){const e=n.textContent.split(C),t=e.length-1;if(t>0){n.textContent=A?A.emptyScript:"";for(let i=0;i<t;i++)n.append(e[i],j()),Y.nextNode(),s.push({type:2,index:++a});n.append(e[t],j())}}}else if(8===n.nodeType)if(n.data===E)s.push({type:2,index:a});else{let e=-1;for(;-1!==(e=n.data.indexOf(C,e+1));)s.push({type:7,index:a}),e+=C.length-1}a++}}static createElement(e,t){const i=M.createElement("template");return i.innerHTML=e,i}}function Q(e,t,i=e,n){if(t===V)return t;let a=void 0!==n?i._$Co?.[n]:i._$Cl;const o=T(t)?void 0:t._$litDirective$;return a?.constructor!==o&&(a?._$AO?.(!1),void 0===o?a=void 0:(a=new o(e),a._$AT(e,i,n)),void 0!==n?(i._$Co??=[])[n]=a:i._$Cl=a),void 0!==a&&(t=Q(e,a._$AS(e,t.values),a,n)),t}class ee{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,n=(e?.creationScope??M).importNode(t,!0);Y.currentNode=n;let a=Y.nextNode(),o=0,r=0,s=i[0];for(;void 0!==s;){if(o===s.index){let t;2===s.type?t=new te(a,a.nextSibling,this,e):1===s.type?t=new s.ctor(a,s.name,s.strings,this,e):6===s.type&&(t=new re(a,this,e)),this._$AV.push(t),s=i[++r]}o!==s?.index&&(a=Y.nextNode(),o++)}return Y.currentNode=M,n}p(e){let t=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class te{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,n){this.type=2,this._$AH=J,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=n,this._$Cv=n?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return void 0!==t&&11===e?.nodeType&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Q(this,e,t),T(e)?e===J||null==e||""===e?(this._$AH!==J&&this._$AR(),this._$AH=J):e!==this._$AH&&e!==V&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):(e=>O(e)||"function"==typeof e?.[Symbol.iterator])(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==J&&T(this._$AH)?this._$AA.nextSibling.data=e:this.T(M.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,n="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=K.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===n)this._$AH.p(t);else{const e=new ee(n,this),i=e.u(this.options);e.p(t),this.T(i),this._$AH=e}}_$AC(e){let t=X.get(e.strings);return void 0===t&&X.set(e.strings,t=new K(e)),t}k(e){O(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,n=0;for(const a of e)n===t.length?t.push(i=new te(this.O(j()),this.O(j()),this,this.options)):i=t[n],i._$AI(a),n++;n<t.length&&(this._$AR(i&&i._$AB.nextSibling,n),t.length=n)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const t=k(e).nextSibling;k(e).remove(),e=t}}setConnected(e){void 0===this._$AM&&(this._$Cv=e,this._$AP?.(e))}}class ie{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,n,a){this.type=1,this._$AH=J,this._$AN=void 0,this.element=e,this.name=t,this._$AM=n,this.options=a,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=J}_$AI(e,t=this,i,n){const a=this.strings;let o=!1;if(void 0===a)e=Q(this,e,t,0),o=!T(e)||e!==this._$AH&&e!==V,o&&(this._$AH=e);else{const n=e;let r,s;for(e=a[0],r=0;r<a.length-1;r++)s=Q(this,n[i+r],t,r),s===V&&(s=this._$AH[r]),o||=!T(s)||s!==this._$AH[r],s===J?e=J:e!==J&&(e+=(s??"")+a[r+1]),this._$AH[r]=s}o&&!n&&this.j(e)}j(e){e===J?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class ne extends ie{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===J?void 0:e}}class ae extends ie{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==J)}}class oe extends ie{constructor(e,t,i,n,a){super(e,t,i,n,a),this.type=5}_$AI(e,t=this){if((e=Q(this,e,t,0)??J)===V)return;const i=this._$AH,n=e===J&&i!==J||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,a=e!==J&&(i===J||n);n&&this.element.removeEventListener(this.name,this,i),a&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class re{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Q(this,e)}}const se=w.litHtmlPolyfillSupport;se?.(K,te),(w.litHtmlVersions??=[]).push("3.3.3");const le=globalThis;class ce extends x{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{const n=i?.renderBefore??t;let a=n._$litPart$;if(void 0===a){const e=i?.renderBefore??null;n._$litPart$=a=new te(t.insertBefore(j(),e),e,void 0,i??{})}return a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return V}}ce._$litElement$=!0,ce.finalized=!0,le.litElementHydrateSupport?.({LitElement:ce});const de=le.litElementPolyfillSupport;de?.({LitElement:ce}),(le.litElementVersions??=[]).push("4.2.2");const ue=e=>(t,i)=>{void 0!==i?i.addInitializer(()=>{customElements.define(e,t)}):customElements.define(e,t)},he={attribute:!0,type:String,converter:y,reflect:!1,hasChanged:v},pe=(e=he,t,i)=>{const{kind:n,metadata:a}=i;let o=globalThis.litPropertyMetadata.get(a);if(void 0===o&&globalThis.litPropertyMetadata.set(a,o=new Map),"setter"===n&&((e=Object.create(e)).wrapped=!0),o.set(i.name,e),"accessor"===n){const{name:n}=i;return{set(i){const a=t.get.call(this);t.set.call(this,i),this.requestUpdate(n,a,e,!0,i)},init(t){return void 0!==t&&this.C(n,void 0,e,t),t}}}if("setter"===n){const{name:n}=i;return function(i){const a=this[n];t.call(this,i),this.requestUpdate(n,a,e,!0,i)}}throw Error("Unsupported decorator location: "+n)};function me(e){return(t,i)=>"object"==typeof i?pe(e,t,i):((e,t,i)=>{const n=t.hasOwnProperty(i);return t.constructor.createProperty(i,e),n?Object.getOwnPropertyDescriptor(t,i):void 0})(e,t,i)}function fe(e){return me({...e,state:!0,attribute:!1})}var _e,ge;!function(e){e.language="language",e.system="system",e.comma_decimal="comma_decimal",e.decimal_comma="decimal_comma",e.space_comma="space_comma",e.none="none"}(_e||(_e={})),function(e){e.language="language",e.system="system",e.am_pm="12",e.twenty_four="24"}(ge||(ge={}));var be=function(e,t,i,n){n=n||{},i=null==i?{}:i;var a=new Event(t,{bubbles:void 0===n.bubbles||n.bubbles,cancelable:Boolean(n.cancelable),composed:void 0===n.composed||n.composed});return a.detail=i,e.dispatchEvent(a),a};const ye="lay-z-spa-card",ve="lay-z-spa-card-editor",$e={climate:"climate.layzspa_temperature_control",bubbles:"switch.layzspa_airbubbles",heater:"binary_sensor.layzspa_heater",ready:"binary_sensor.layzspa_ready",time_to_ready:"sensor.layzspa_time_to_ready",ambient:"number.layzspa_amb_temp_c",error:"sensor.layzspa_error",connection:"binary_sensor.layzspa_connection",power_switch:"switch.jacuzzi",power:"sensor.jacuzzi_power",energy_today:"sensor.jacuzzi_energia_energy_daily",usage:"input_select.jacuzzi_uso",desired:"input_number.jacuzzi_temp_deseada",maintenance:"input_number.jacuzzi_temp_mantenimiento",plan:"sensor.jacuzzi_plan",planner:"input_boolean.jacuzzi_planificador",observe:"input_boolean.jacuzzi_planificador_observar",grid_extra:"sensor.jacuzzi_extra_red",ready_time:"input_datetime.jacuzzi_hora_listo",answer_script:"script.jacuzzi_respuesta_no_llega",ready_until:"input_datetime.jacuzzi_hora_fin",heat_today:"input_boolean.jacuzzi_hoy_si",skip_today:"input_boolean.jacuzzi_hoy_no",filter_min:"input_number.jacuzzi_depuracion_minima",filter_today:"sensor.jacuzzi_depuracion_hoy",chlorine_age:"sensor.layzspa_chlorine_age",chlorine_interval:"number.layzspa_chlorine_interval",chlorine_reset:"button.layzspa_reset_chlorine_timer",filter_rinse_age:"sensor.layzspa_filter_rinse",filter_rinse_interval:"number.layzspa_filter_rinse_interval",filter_rinse_reset:"button.layzspa_reset_filter_rinse_timer",filter_clean_age:"sensor.layzspa_filter_clean",filter_clean_interval:"number.layzspa_filter_clean_interval",filter_clean_reset:"button.layzspa_reset_filter_clean_timer",filter_change_age:"sensor.layzspa_filter_age",filter_change_interval:"number.layzspa_filter_change_interval",filter_change_reset:"button.layzspa_reset_filter_change_timer"},xe=["lun","mar","mie","jue","vie","sab","dom","fes"],we=xe.map(e=>`input_boolean.jacuzzi_dia_${e}`),ke=xe.map(e=>`input_datetime.jacuzzi_hora_${e}`),Ae=new Set(["unavailable","unknown"]);function ze(e){if(null==e||""===e)return null;const t=Number(e);return Number.isFinite(t)?t:null}function Se(e){return!!e&&!Ae.has(e.state)}function Ce(e){return Se(e)?ze(e.state):null}function Ee(e,t){return t?e[t]:void 0}const Pe={heating:"heat",idle:"heat",fan:"fan_only",off:"off"};function Me(e){return e&&"unavailable"!==e.state?"unknown"!==e.state?e.state:Pe[String(e.attributes.hvac_action)]??null:null}function je(e,t){if("off"===Ee(e,t.power_switch)?.state)return"no_power";const i=Ee(e,t.connection);if(!!t.connection&&"on"!==i?.state){const i=Ce(Ee(e,t.power));return null!==i&&i<1?"rcd_tripped":"board_offline"}return null!==Me(e[t.climate])?"ok":"board_offline"}const Te={no_power:{icon:"mdi:power-plug-off",title:"Sin corriente",detail:"Enchufe del jacuzzi apagado"},rcd_tripped:{icon:"mdi:flash-alert",title:"Sin corriente en la bomba",detail:"Rearma el diferencial del cable del jacuzzi"},board_offline:{icon:"mdi:wifi-off",title:"Placa WiFi sin conexión",detail:"La bomba tiene corriente pero la placa no responde"}};function Oe(e,t){const i=new Date(t.getTime()+6e4*Math.round(60*e)),n=`${String(i.getHours()).padStart(2,"0")}:${String(i.getMinutes()).padStart(2,"0")}`;return i.toDateString()===t.toDateString()?`a las ${n}`:`mañana a las ${n}`}function Re(e){return String(Math.round(e)).replace(/\B(?=(\d{3})+(?!\d))/g,".")}function Ue(e){let t=ze(e.min_temp)??20,i=ze(e.max_temp)??40;t>=i&&(t=20,i=40);const n=ze(e.target_temp_step);return{min:t,max:i,step:null!==n&&n>0?n:1}}function He(e,t,i){return e?null!==t&&t===e.value||i-e.at>1e4?null:e.value:null}function Le(e){const t=Math.round(10*e)/10;return(Number.isInteger(t)?String(t):t.toFixed(1)).replace(".",",")}const Ne=210,Ie=80;function De(e,t,i,n){const a=(n-90)*Math.PI/180;return{x:e+i*Math.cos(a),y:t+i*Math.sin(a)}}function Be(e,t,i,n,a){const o=De(e,t,i,a),r=De(e,t,i,n),s=a-n<=180?"0":"1";return`M ${o.x} ${o.y} A ${i} ${i} 0 ${s} 0 ${r.x} ${r.y}`}function Fe(e,t,i,n){const a=Math.round(e/n)*n;return Number(Math.min(i,Math.max(t,a)).toFixed(2))}function We(e,t,i){const n=Math.min(1,Math.max(0,(e-t)/(i-t)));return Ne+300*n}function qe(e,t,i,n){return Fe(t+function(e){let t;return t=e>=Ne?(e-Ne)/300:e<=150?(e+360-Ne)/300:e-150<Ne-e?1:0,Math.min(1,Math.max(0,t))}(e)*(i-t),t,i,n)}function Ve(e,t){let i=180*Math.atan2(t,e)/Math.PI+90;return i<0&&(i+=360),i}function Je(e){const t=new Set(e),i={};for(const[e,n]of Object.entries($e))t.has(n)&&(i[e]=n);const n=i.climate??e.find(e=>e.startsWith("climate.")&&e.includes("layzspa"))??$e.climate,a=[...we,...ke].every(e=>t.has(e))?{schedule_days:we,schedule_times:ke}:{};return{...i,...a,climate:n}}const Xe=["Hoy","Siempre"];function Ye(e,t){return!!(t.planner&&t.usage&&t.desired&&t.maintenance)&&"on"===e[t.planner]?.state}function Ze(e,t){return!!t.usage&&Xe.includes(e[t.usage]?.state??"")}function Ge(e,t){return!!t.skip_today&&"on"===e[t.skip_today]?.state}function Ke(e,t){const i=Qe(e,t)?.b;return"boolean"==typeof i?i:Ze(e,t)&&!Ge(e,t)}function Qe(e,t){const i=t.plan?e[t.plan]?.state??"":"";if(!i.startsWith("{"))return null;try{return JSON.parse(i)}catch{return null}}function et(e){return Ue({min_temp:e.min,max_temp:e.max,target_temp_step:e.step})}function tt(e,t){if(Ye(e,t)){const i=Ke(e,t),n=i?t.desired:t.maintenance,a=e[n],{min:o,max:r,step:s}=et(a?.attributes??{});return{kind:"helper",entity:n,value:Ce(a),min:o,max:r,step:s,caption:i?"deseada":"mantenimiento"}}const i=e[t.climate],{min:n,max:a,step:o}=Ue(i?.attributes??{});return{kind:"climate",entity:t.climate,value:ze(i?.attributes.temperature),min:n,max:a,step:o,caption:null}}function it(e,t){if(!t.plan||!Ye(e,t))return null;const i=Qe(e,t);return i?{text:String(i.m??""),heating:"calentar"===i.a,filtering:"depurar"===i.a,grid:!0===i.r,observing:!!t.observe&&"on"===e[t.observe]?.state,rule:Number(i.n??-1),ask:!0===i.i,kept:!0===i.k,forced:!0===i.c,bath:"boolean"==typeof i.b?i.b:null,reason:"guardia"===i.g||"apagado"===i.g?i.g:""}:null}function nt(e,t,i){if(!Ye(e,t))return null;const n=t[i],a=e[n],{min:o,max:r,step:s}=et(a?.attributes??{});return{entity:n,value:Ce(a),min:o,max:r,step:s}}function at(e,t){if(!t.ready_time||!Ye(e,t)||!Ke(e,t))return null;const i=e[t.ready_time];return Se(i)&&/^\d{2}:\d{2}/.test(i.state)?{entity:t.ready_time,value:i.state.slice(0,5)}:null}function ot(e,t,i){if(!i||!Ye(e,t))return null;const n=e[i];return Se(n)&&/^\d{2}:\d{2}/.test(n.state)?{entity:i,value:n.state.slice(0,5)}:null}const rt=["L","M","X","J","V","S","D","Festivo"];function st(e,t){const i=t.filter_min;if(!i||!Ye(e,t)||!Se(e[i]))return null;const n=e[i].attributes;return{entity:i,value:Ce(e[i]),min:ze(n.min)??0,max:ze(n.max)??12,step:ze(n.step)??.5,today:Ce(t.filter_today?e[t.filter_today]:void 0)}}function lt(e){const t=Math.round(60*e),i=Math.floor(t/60),n=t%60;return n?`${i} h ${String(n).padStart(2,"0")}`:`${i} h`}function ct(e,t){return{domain:"input_boolean",service:t?"turn_on":"turn_off",data:{entity_id:e}}}const dt={chlorine:{label:"Cloro",icon:"mdi:flask-outline",action:"Echar cloro"},filter_rinse:{label:"Aclarado",icon:"mdi:water-sync",action:"Aclarar el filtro"},filter_clean:{label:"Limpieza",icon:"mdi:spray-bottle",action:"Limpiar el filtro"},filter_change:{label:"Filtro",icon:"mdi:filter-remove",action:"Cambiar el filtro"}},ut=["chlorine","filter_rinse","filter_clean","filter_change"];function ht(e,t){const i=[];for(const n of ut){const a=t[`${n}_age`],o=t[`${n}_interval`];if(!a||!o)continue;const r=Ce(e[a]),s=Ce(e[o]);null===r||null===s||s<=0||r<s||i.push({key:n,...dt[n],age:r,interval:s,age_entity:a,reset:t[`${n}_reset`]??null})}return i}function pt(e){const t=Math.floor(e);return`${t} ${1===t?"día":"días"}`}const mt=[{name:"name",selector:{text:{}}},{name:"climate",required:!0,selector:{entity:{domain:"climate"}}},{name:"bubbles",selector:{entity:{domain:"switch"}}},{name:"heater",selector:{entity:{domain:"binary_sensor"}}},{name:"ready",selector:{entity:{domain:"binary_sensor"}}},{name:"time_to_ready",selector:{entity:{domain:"sensor"}}},{name:"ambient",selector:{entity:{domain:["number","sensor"]}}},{name:"error",selector:{entity:{domain:"sensor"}}},{name:"connection",selector:{entity:{domain:"binary_sensor"}}},{name:"power_switch",selector:{entity:{domain:"switch"}}},{name:"power",selector:{entity:{domain:"sensor"}}},{name:"energy_today",selector:{entity:{domain:"sensor"}}},{name:"usage",selector:{entity:{domain:"input_select"}}},{name:"desired",selector:{entity:{domain:"input_number"}}},{name:"maintenance",selector:{entity:{domain:"input_number"}}},{name:"plan",selector:{entity:{domain:"sensor"}}},{name:"planner",selector:{entity:{domain:"input_boolean"}}},{name:"observe",selector:{entity:{domain:"input_boolean"}}},{name:"grid_extra",selector:{entity:{domain:"sensor"}}},{name:"ready_time",selector:{entity:{domain:"input_datetime"}}},{name:"answer_script",selector:{entity:{domain:"script"}}},{name:"ready_until",selector:{entity:{domain:"input_datetime"}}},{name:"schedule_days",selector:{entity:{domain:"input_boolean",multiple:!0}}},{name:"schedule_times",selector:{entity:{domain:"input_datetime",multiple:!0}}},{name:"heat_today",selector:{entity:{domain:"input_boolean"}}},{name:"skip_today",selector:{entity:{domain:"input_boolean"}}},{name:"filter_min",selector:{entity:{domain:"input_number"}}},{name:"filter_today",selector:{entity:{domain:"sensor"}}},...["chlorine","filter_rinse","filter_clean","filter_change"].flatMap(e=>[{name:`${e}_age`,selector:{entity:{domain:"sensor"}}},{name:`${e}_interval`,selector:{entity:{domain:["number","input_number"]}}},{name:`${e}_reset`,selector:{entity:{domain:["button","script"]}}}])],ft={name:"Nombre",climate:"Termostato del jacuzzi (climate)",bubbles:"Burbujas (switch)",heater:"Resistencia calentando (binary_sensor)",ready:"Agua lista (binary_sensor)",time_to_ready:"Tiempo hasta listo, en horas (sensor)",ambient:"Temperatura ambiente",error:"Código de error de la bomba (sensor)",connection:"Placa WiFi conectada (binary_sensor)",power_switch:"Enchufe del jacuzzi, solo lectura (switch)",power:"Potencia real en W (sensor)",energy_today:"Energía de hoy (sensor)",usage:"Planificador: uso No/Hoy/Siempre (input_select)",desired:"Planificador: temperatura deseada (input_number)",maintenance:"Planificador: temperatura de mantenimiento (input_number)",plan:"Planificador: plan en JSON (sensor)",planner:"Planificador: encendido (input_boolean)",observe:"Planificador: modo observar (input_boolean)",grid_extra:"Importación extra de red en W (sensor)",ready_time:"Planificador: hora de listo de hoy (input_datetime)",answer_script:"Planificador: respuesta al aviso de «no llega» (script)",ready_until:"Planificador: baño hasta (input_datetime)",schedule_days:"Planificador: horario semanal, ¿baño ese día? (8 input_boolean: L, M, X, J, V, S, D, Festivo)",schedule_times:"Planificador: horario semanal, hora del baño (8 input_datetime, mismo orden)",heat_today:"Planificador: calentar hoy aunque toque no o haya guardia (input_boolean)",skip_today:"Planificador: hoy no lo uso, solo mantenimiento hasta medianoche (input_boolean)",filter_min:"Planificador: depuración mínima diaria, en horas (input_number)",filter_today:"Planificador: horas de bomba de hoy (sensor)",chlorine_age:"Cloro: días desde el último (sensor)",chlorine_interval:"Cloro: cada cuántos días (number)",chlorine_reset:"Cloro: reiniciar el contador (button)",filter_rinse_age:"Aclarado del filtro: días desde el último (sensor)",filter_rinse_interval:"Aclarado del filtro: cada cuántos días (number)",filter_rinse_reset:"Aclarado del filtro: reiniciar el contador (button)",filter_clean_age:"Limpieza del filtro: días desde la última (sensor)",filter_clean_interval:"Limpieza del filtro: cada cuántos días (number)",filter_clean_reset:"Limpieza del filtro: reiniciar el contador (button)",filter_change_age:"Cambio de filtro: días desde el último (sensor)",filter_change_interval:"Cambio de filtro: cada cuántos días (number)",filter_change_reset:"Cambio de filtro: reiniciar el contador (button)"};let _t=class extends ce{constructor(){super(...arguments),this._computeLabel=e=>ft[e.name]??e.name}setConfig(e){this._config=e}render(){return this.hass&&this._config?W`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${mt}
        .computeLabel=${this._computeLabel}
        @value-changed=${this._valueChanged}
      ></ha-form>
      <p class="hint">Solo el termostato es obligatorio; lo que falte se oculta en la tarjeta. Con el planificador encendido, el dial edita la temperatura deseada o la de mantenimiento.</p>
    `:J}_valueChanged(e){be(this,"config-changed",{config:e.detail.value})}};_t.styles=r`
    .hint {
      color: var(--secondary-text-color);
      font-size: 0.85em;
      margin-top: 8px;
    }
  `,e([me({attribute:!1})],_t.prototype,"hass",void 0),e([fe()],_t.prototype,"_config",void 0),_t=e([ue(ve)],_t),console.info("%c LAY-Z-SPA-CARD %c v0.4.0 ","color: white; background: #ff8100; font-weight: 700;","color: #ff8100; background: #1c1c1c; font-weight: 700;"),window.customCards=window.customCards||[],window.customCards.push({type:ye,name:"Lay-Z-Spa Card",description:"Gestión del jacuzzi: temperatura, modos, burbujas, tiempo hasta listo y consumo",preview:!0});const gt="#6f7176",bt={off:{icon:"mdi:power",label:"Apagado",color:gt,dot:"#4a4b4f"},fan_only:{icon:"mdi:fan",label:"Filtro",color:"#2b9af9",dot:"#15578f"},heat:{icon:"mdi:fire",label:"Calor",color:"#ff8100",dot:"#9c4e00"}},yt=["off","fan_only","heat"];let vt=class extends ce{constructor(){super(...arguments),this._dragging=!1,this._dragTemp=null,this._pending=null,this._pendingEntity=null,this._settingsOpen=!1,this._careConfirm=null,this._careTimer=null,this._careLongPressed=!1,this._valueAngle=0,this._dragPointerId=null,this._boundMove=e=>this._onPointerMove(e),this._boundUp=e=>this._onPointerUp(e),this._careRelease=()=>{null!==this._careTimer&&window.clearTimeout(this._careTimer),this._careTimer=null},this._careClose=()=>{this._careConfirm=null},this._toggleBubbles=()=>{this.config.bubbles&&this.hass.callService("switch","toggle",{entity_id:this.config.bubbles})},this._togglePlanner=()=>{this.config.planner&&this.hass.callService("input_boolean","toggle",{entity_id:this.config.planner})},this._toggleSettings=()=>{this._settingsOpen=!this._settingsOpen}}static async getConfigElement(){return document.createElement(ve)}static getStubConfig(e){return{name:"Jacuzzi",...Je(e?Object.keys(e.states):[])}}setConfig(e){if(!e.climate)throw new Error("Falta 'climate'");this.config={...e}}getCardSize(){return 6}disconnectedCallback(){super.disconnectedCallback(),this._removeWindowListeners(),this._careRelease()}get _states(){return this.hass.states}render(){if(!this.hass||!this.config)return J;const e=this._states,t=e[this.config.climate];if(!t)return W`<ha-card><div class="warn">Entidad no encontrada: ${this.config.climate}</div></ha-card>`;const i=je(e,this.config),n="ok"===i,a=Me(t)??t.state,o=bt[a],r=n&&o?o.color:gt,s=n&&o?o.dot:"#4a4b4f",l=tt(e,this.config),{min:c,max:d}=l,u=He(this._pendingFor(l.entity),l.value,Date.now()),h=function(e,t,i){return e??t??i}(this._dragTemp,u,l.value),p=n?ze(t.attributes.current_temperature):null,m=n&&!!this.config.heater&&"on"===e[this.config.heater]?.state,f=null!==h,_=We(h??c,c,d);this._valueAngle=f?_%360:-999;const g=De(100,100,Ie,_),b=null!==p?We(p,c,d):null,y=null!==b?De(100,100,Ie,b):null,v=null!==b?Math.min(_,b):Ne,$=null!==b?Math.max(_,b):_,x=`grad-${a}`,w=o?"heat"===a&&m?"Calentando":o.label:a,k=Ce(this.config.power?e[this.config.power]:void 0),A=function(e,t){const i=t.planner?e[t.planner]:void 0;return t.planner&&Se(i)?{entity:t.planner,on:"on"===i.state}:null}(e,this.config);return W`
      <ha-card style="--accent:${r}">
        <div class="header">
          <span class="title"><ha-icon icon="mdi:hot-tub"></ha-icon>${this.config.name??"Jacuzzi"}</span>
          <span class="header-center">
            ${A?W`<button
                  class="planner-toggle ${A.on?"on":""}"
                  title=${A.on?"Planificador encendido: tócalo para apagarlo":"Planificador apagado: tócalo para encenderlo"}
                  @click=${this._togglePlanner}
                >
                  <ha-icon icon=${A.on?"mdi:robot":"mdi:robot-off"}></ha-icon>Planificador
                </button>`:J}
          </span>
          <span class="header-right">
          ${null!==k?W`<button
                class="power"
                title="Consumo real"
                @click=${()=>this._openMoreInfo(this.config.energy_today||this.config.power)}
              >
                <ha-icon icon="mdi:flash"></ha-icon>${Re(k)} W
              </button>`:J}
          </span>
        </div>

        <div class="dial-wrap">
          <svg viewBox="0 0 200 200" class="dial" @pointerdown=${this._onPointerDown}>
            <defs>
              <linearGradient id=${x} x1="0" y1="0" x2="1" y2="1">
                ${"fan_only"===a?q`<stop offset="0%" stop-color="#5cc6ff" /><stop offset="100%" stop-color="#1f7fd6" />`:"heat"===a?q`<stop offset="0%" stop-color="#ffb454" /><stop offset="100%" stop-color="#e8730a" />`:q`<stop offset="0%" stop-color="#8a8c91" /><stop offset="100%" stop-color="#5d5f63" />`}
              </linearGradient>
            </defs>
            <path class="track" d=${Be(100,100,Ie,Ne,510)} />
            ${n&&f?q`
                <path class="glow" style="stroke:${r}" d=${Be(100,100,Ie,v,$)} />
                <path class="value" style="stroke:url(#${x})" d=${Be(100,100,Ie,v,$)} />
                ${y?q`<circle class="curdot" style="fill:${s}" cx=${y.x} cy=${y.y} r="4" />`:J}
                <circle class="handle ${m?"pulse":""}" style="stroke:${r}" cx=${g.x} cy=${g.y} r="8" />`:J}
          </svg>
          <div class="dial-center">${n?this._renderCenter(w,h,p,l.caption):this._renderUnavailable(i)}</div>
          ${this._renderCare()}
        </div>

        ${n?this._renderInfo():J} ${n?this._renderPlanner():J}
        ${this._renderModes(n,a,t.attributes.hvac_modes)}
        ${this._renderCareConfirm()}
      </ha-card>
    `}_renderCenter(e,t,i,n){return W`
      <div class="center-tap clickable" title="Ver detalle" @click=${()=>this._openMoreInfo(this.config.climate)}>
        <div class="mode-name">${e}</div>
        <div class="target">
          <span class="int">${null!==t?Math.round(t):"--"}</span><span class="unit">°C</span>
        </div>
        ${n?W`<div class="caption">${n}</div>`:J}
      </div>
      ${null!==i?W`<div class="current clickable" title="Ver histórico" @click=${()=>this._openMoreInfo(this.config.climate)}>
            <ha-icon icon="mdi:water-thermometer"></ha-icon>${Le(i)} °C
          </div>`:J}
      <div class="adjust">
        <button class="round" @click=${()=>this._step(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
        <button class="round" @click=${()=>this._step(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>
    `}_renderCare(){const e=ht(this._states,this.config);return e.length?W`${e.map(e=>W`<button
        class="care care-${e.key}"
        title="${e.action}: hace ${pt(e.age)} (cada ${pt(e.interval)}). Mantén pulsado para reiniciar"
        @pointerdown=${t=>this._carePress(t,e)}
        @pointerup=${this._careRelease}
        @pointerleave=${this._careRelease}
        @pointercancel=${this._careRelease}
        @contextmenu=${e=>e.preventDefault()}
        @click=${()=>this._careClick(e)}
      >
        <ha-icon icon=${e.icon}></ha-icon>
        <span class="care-label">${e.label}</span>
      </button>`)}`:J}_renderCareConfirm(){const e=this._careConfirm?ht(this._states,this.config).find(e=>e.key===this._careConfirm):void 0;return e?W`<div class="care-backdrop" @click=${this._careClose}>
      <div class="care-dialog" role="dialog" aria-modal="true" @click=${e=>e.stopPropagation()}>
        <ha-icon icon=${e.icon}></ha-icon>
        <div class="care-title">${e.action}</div>
        <div class="care-detail">Hace ${pt(e.age)}; toca cada ${pt(e.interval)}.</div>
        <div class="care-question">¿Ya está hecho? Reinicia el contador.</div>
        <div class="care-actions">
          <button @click=${this._careClose}>Cancelar</button>
          <button class="primary" @click=${()=>this._careReset(e)}>Reiniciar</button>
        </div>
      </div>
    </div>`:J}_carePress(e,t){0===e.button&&(this._careLongPressed=!1,this._careRelease(),this._careTimer=window.setTimeout(()=>{this._careTimer=null,this._careLongPressed=!0,t.reset&&(this._careConfirm=t.key)},500))}_careClick(e){this._careLongPressed?this._careLongPressed=!1:this._openMoreInfo(e.age_entity)}_careReset(e){if(this._careConfirm=null,!e.reset)return;const t=function(e){const t=e.split(".")[0];return{domain:t,service:"script"===t?"turn_on":"press",data:{entity_id:e}}}(e.reset);this.hass.callService(t.domain,t.service,t.data)}_renderUnavailable(e){const t=Te[e];return W`
      <ha-icon class="unavail-icon" icon=${t.icon}></ha-icon>
      <div class="unavail-title">${t.title}</div>
      <div class="unavail-detail">${t.detail}</div>
    `}_renderInfo(){const e=this._states,t=Ce(this.config.ambient?e[this.config.ambient]:void 0),i=e[this.config.climate],n=i?ze(i.attributes.current_temperature):null,a=function(e,t,i){return"helper"!==t.kind||"ready"!==e.kind?e:null===i||null===t.value||i<t.value?{kind:"none"}:e}(function(e,t,i=new Date){const n=e[t.climate];if(!n||"heat"!==n.state)return{kind:"none"};const a=Ee(e,t.ready);if(Se(a)){if("on"===a.state)return{kind:"ready"}}else{const e=ze(n.attributes.current_temperature),t=ze(n.attributes.temperature);if(null!==e&&null!==t&&e>=t)return{kind:"ready"}}const o=Ce(Ee(e,t.time_to_ready));return null===o||o<=0||o>96?{kind:"none"}:{kind:"eta",text:Oe(o,i)}}(e,this.config),tt(e,this.config),n),o=function(e,t){const i=Ce(Ee(e,t.error));return null===i||0===i?null:`E${String(Math.trunc(i)).padStart(2,"0")}`}(e,this.config),r=function(e,t){const i=Ce(t.grid_extra?e[t.grid_extra]:void 0);return null!==i&&i>0?i:null}(e,this.config);return W`
      <div class="info">
        ${null!==t?W`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.ambient)}>
              <ha-icon icon="mdi:home-thermometer-outline"></ha-icon>Amb. ${Le(t)} °C
            </span>`:J}
        ${null!==r?W`<span class="item grid-extra clickable" title="Importando de la red para el jacuzzi (sin batería)" @click=${()=>this._openMoreInfo(this.config.grid_extra)}>
              <ha-icon icon="mdi:transmission-tower-import"></ha-icon>+${Re(r)} W red
            </span>`:J}
        ${"ready"===a.kind?W`<span class="chip ready"><ha-icon icon="mdi:check-circle"></ha-icon>Listo</span>`:"eta"===a.kind?W`<span class="item clickable" @click=${()=>this._openMoreInfo(this.config.time_to_ready)}>
              <ha-icon icon="mdi:timer-sand"></ha-icon>Listo ${a.text}
            </span>`:J}
      </div>
      ${o?W`<div class="warnings"><span class="chip error"><ha-icon icon="mdi:alert"></ha-icon>Error ${o}</span></div>`:J}
    `}_renderModes(e,t,i){const n=Array.isArray(i)?i:yt,a=function(e,t){if(!t.bubbles)return"none";const i=e[t.bubbles];return Se(i)?"on"===i.state?"on":"off":"unavailable"}(this._states,this.config);return W`
      <div class="bar">
        <div class="modes">
          ${yt.filter(e=>n.includes(e)).map(i=>{const n=bt[i];return W`<button
              class="mode ${e&&t===i?"active":""}"
              style="--mode-color:${n.color}"
              title=${n.label}
              ?disabled=${!e}
              @click=${()=>this._setMode(i)}
            >
              <ha-icon icon=${n.icon}></ha-icon>
            </button>`})}
        </div>
        ${"none"!==a?W`<button
              class="bubbles ${e&&"on"===a?"active":""}"
              title=${"unavailable"===a?"Burbujas sin datos":"Burbujas"}
              ?disabled=${!e||"unavailable"===a}
              @click=${this._toggleBubbles}
            >
              <ha-icon icon="mdi:chart-bubble"></ha-icon>
            </button>`:J}
      </div>
    `}_setMode(e){this.hass.callService("climate","set_hvac_mode",{entity_id:this.config.climate,hvac_mode:e})}_pendingFor(e){return this._pendingEntity===e?this._pending:null}_step(e){const t=tt(this._states,this.config),{min:i,max:n,step:a}=t,o=He(this._pendingFor(t.entity),t.value,Date.now())??t.value??i,r=Fe(o+e*a,i,n,a);r!==o&&this._sendTarget(r)}_sendTarget(e){const t=tt(this._states,this.config);this._pending={value:e,at:Date.now()},this._pendingEntity=t.entity;const i=function(e,t){return"helper"===e.kind?{domain:"input_number",service:"set_value",data:{entity_id:e.entity,value:t}}:{domain:"climate",service:"set_temperature",data:{entity_id:e.entity,temperature:t}}}(t,e);this.hass.callService(i.domain,i.service,i.data)}_renderPlanner(){const e=this._states,t=it(e,this.config),i=function(e,t){if(!Ye(e,t))return null;const i=t.usage?e[t.usage]:void 0;if(!Se(i))return null;const n=Array.isArray(i.attributes.options)?i.attributes.options.map(String):[];return{current:i.state,options:n}}(e,this.config),n=nt(e,this.config,"desired"),a=nt(e,this.config,"maintenance"),o=at(e,this.config),r=function(e,t){const i=it(e,t);if(!i||i.observing||!t.answer_script||!Se(e[t.answer_script]))return null;const n=i.ask?"ask":i.kept?"kept":i.forced?"forced":null;return n?{script:t.answer_script,mode:n}:null}(e,this.config),s=function(e,t,i){const n=t.skip_today;if(!(n&&Ye(e,t)&&Se(e[n])&&Ke(e,t)))return null;const a=at(e,t);if(!a)return null;const[o,r]=a.value.split(":").map(Number);return 60*i.getHours()+i.getMinutes()>=60*o+r-30?{entity:n}:null}(e,this.config,new Date),l=function(e,t,i){return ot(e,t,t[i])}(e,this.config,"ready_until"),c=function(e,t){const i=t.schedule_days;if(!i?.length||!Ye(e,t))return null;const n=[];return i.slice(0,rt.length).forEach((i,a)=>{Se(e[i])&&n.push({label:rt[a],day:i,on:"on"===e[i].state,time:ot(e,t,t.schedule_times?.[a])})}),n.length?n:null}(e,this.config),d=function(e,t){const i=t.heat_today;if(!i||!Ye(e,t)||!Se(e[i]))return null;const n="on"===e[i].state,a=it(e,t)?.reason??"";return n||a?{entity:i,on:n,reason:a,time:ot(e,t,t.ready_time)}:null}(e,this.config),u=function(e,t){const i=t.skip_today;if(!i||!Ye(e,t)||!Se(e[i]))return null;const n=Ge(e,t);return n||Ze(e,t)?{entity:i,on:n}:null}(e,this.config),h=st(e,this.config),p=!!(n||a||o||l||c||u||h);return t||i||p?W`
      ${t?W`<div class="plan ${t.observing?"observing":""} clickable" title="Plan del jacuzzi" @click=${()=>this._openMoreInfo(this.config.plan)}>
            <ha-icon icon=${t.observing?"mdi:eye":t.filtering?"mdi:air-filter":"mdi:robot"}></ha-icon>
            <span>${t.observing?"Observando: ":""}${t.text}${t.grid?" · red":""}</span>
          </div>`:J}
      ${r||s||d?W`<div class="answer">
            ${r&&"forced"!==r.mode?W`<button class="heat" @click=${()=>this._answer(r.script,"jacuzzi_calentar")}>
                  <ha-icon icon="mdi:fire"></ha-icon>Calentar igualmente
                </button>`:J}
            ${r&&"kept"!==r.mode?W`<button @click=${()=>this._answer(r.script,"jacuzzi_mantener")}>
                  <ha-icon icon="mdi:snowflake"></ha-icon>Mantener
                </button>`:J}
            ${d?W`<button class=${d.on?"":"heat"} title="Solo hoy; a medianoche vuelve el horario" @click=${()=>this._setHeatToday(d.entity,!d.on)}>
                  <ha-icon icon=${d.on?"mdi:calendar-remove":"mdi:fire"}></ha-icon>${d.on?"Hoy no":"Calentar hoy"}
                </button>`:J}
            ${d&&!d.on&&d.time?W`<div class="pill" title="Hora del baño de hoy">
                  <input class="ready-time" type="time" step="900" .value=${d.time.value} @change=${e=>this._setTime(d.time.entity,e)} />
                </div>`:J}
            ${s?W`<button title="Solo mantenimiento hasta medianoche; mañana vuelve el uso de siempre" @click=${()=>this._finish(s.entity)}>
                  <ha-icon icon="mdi:check-circle-outline"></ha-icon>Hemos terminado
                </button>`:J}
          </div>`:J}
      ${i?W`<div class="usage">
            ${i.options.map(e=>W`<button class="${e===i.current?"active":""}" @click=${()=>this._setUsage(e)}>${e}</button>`)}
          </div>`:J}
      ${p?W`<div class="settings ${this._settingsOpen?"open":""}">
            <button class="settings-toggle" aria-expanded=${this._settingsOpen?"true":"false"} @click=${this._toggleSettings}>
              <ha-icon icon="mdi:tune-variant"></ha-icon>
              <span class="setting-label">${this._settingsOpen?"Ajustes":function(e,t,i=null,n=!1,a=null,o=!1){const r=[];n?r.push("Hoy no se usa"):o&&r.push("Hoy no toca");const s=e=>null!==e.value?Le(e.value):"--",l=e?.desired,c=e?.maint;return l&&c?r.push(`${s(l)}/${s(c)} °C`):l?r.push(`Deseada ${s(l)} °C`):c&&r.push(`Mant. ${s(c)} °C`),t&&r.push(`Baño ${t.value}${i&&"00:00"!==i.value?`–${i.value}`:""}`),a&&a.value&&r.push(`Dep. ${lt(a.value)}`),r.join(" · ")}({desired:n,maint:a},o,l,!!u?.on,h,!1===it(e,this.config)?.bath)||"Horas del baño"}</span>
              <ha-icon class="chevron" icon="mdi:chevron-down"></ha-icon>
            </button>
            ${this._settingsOpen&&u?W`<div class="setting">
                  <ha-icon icon="mdi:calendar-remove"></ha-icon>
                  <span class="setting-label">Hoy no lo uso</span>
                  <ha-switch .checked=${u.on} @change=${e=>this._setSkipToday(u.entity,e)}></ha-switch>
                </div>`:J}
            ${this._settingsOpen?this._tempRow("mdi:thermometer-high","Deseada","desired",n):J}
            ${this._settingsOpen?this._tempRow("mdi:wrench-outline","Mantenimiento","maintenance",a):J}
            ${this._settingsOpen&&h?W`<div class="setting">
                  <ha-icon icon="mdi:air-filter"></ha-icon>
                  <span class="setting-label">Depuración mínima${null!==h.today?W`<span class="setting-sub">hoy ${lt(h.today)}</span>`:J}</span>
                  <div class="pill">
                    <button class="pill-btn" title="Menos" @click=${()=>this._stepFilter(-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
                    <span class="pill-value">${null!==h.value?lt(h.value):"--"}</span>
                    <button class="pill-btn" title="Más" @click=${()=>this._stepFilter(1)}><ha-icon icon="mdi:plus"></ha-icon></button>
                  </div>
                </div>`:J}
            ${this._settingsOpen?this._timeRow("mdi:clock-outline","Baño hoy a las",o):J}
            ${this._settingsOpen?this._timeRow("mdi:clock-end","Baño hasta",l):J}
            ${this._settingsOpen&&c?W`<div class="setting">
                    <ha-icon icon="mdi:calendar-week"></ha-icon>
                    <span class="setting-label">Horario</span>
                  </div>
                  ${c.map(e=>this._scheduleRow(e))}`:J}
          </div>`:J}
    `:J}_answer(e,t){const i=function(e,t,i){return{domain:"script",service:"turn_on",data:{entity_id:e,variables:{respuesta:t,quien:i||"Alguien"}}}}(e,t,this.hass.user?.name);this.hass.callService(i.domain,i.service,i.data)}_setUsage(e){this.config.usage&&this.hass.callService("input_select","select_option",{entity_id:this.config.usage,option:e})}_finish(e){const t=ct(e,!0);this.hass.callService(t.domain,t.service,t.data)}_setSkipToday(e,t){const i=ct(e,t.target.checked);this.hass.callService(i.domain,i.service,i.data)}_timeRow(e,t,i){return i?W`<div class="setting">
      <ha-icon icon=${e}></ha-icon>
      <span class="setting-label">${t}</span>
      <div class="pill">
        <input class="ready-time" type="time" step="900" .value=${i.value} @change=${e=>this._setTime(i.entity,e)} />
      </div>
    </div>`:J}_scheduleRow(e){return W`<div class="setting day ${e.on?"":"off"}">
      <span class="day-label">${e.label}</span>
      <ha-switch .checked=${e.on} @change=${t=>this._setHeatToday(e.day,t.target.checked)}></ha-switch>
      <span class="setting-label"></span>
      ${e.time?W`<div class="pill">
            <input class="ready-time" type="time" step="900" .value=${e.time.value} @change=${t=>this._setTime(e.time.entity,t)} />
          </div>`:J}
    </div>`}_setHeatToday(e,t){const i=ct(e,t);this.hass.callService(i.domain,i.service,i.data)}_setTime(e,t){const i=t.target.value;/^\d{2}:\d{2}$/.test(i)&&this.hass.callService("input_datetime","set_datetime",{entity_id:e,time:`${i}:00`})}_tempRow(e,t,i,n){return n?W`<div class="setting">
      <ha-icon icon=${e}></ha-icon>
      <span class="setting-label">${t}</span>
      <div class="pill">
        <button class="pill-btn" title="Bajar" @click=${()=>this._stepTemp(i,-1)}><ha-icon icon="mdi:minus"></ha-icon></button>
        <span class="pill-value">${null!==n.value?Le(n.value):"--"} °C</span>
        <button class="pill-btn" title="Subir" @click=${()=>this._stepTemp(i,1)}><ha-icon icon="mdi:plus"></ha-icon></button>
      </div>
    </div>`:J}_stepTemp(e,t){const i=nt(this._states,this.config,e);if(!i||null===i.value)return;const n=Fe(i.value+t*i.step,i.min,i.max,i.step);n!==i.value&&this.hass.callService("input_number","set_value",{entity_id:i.entity,value:n})}_stepFilter(e){const t=st(this._states,this.config);if(!t||null===t.value)return;const i=Math.min(t.max,Math.max(t.min,Math.round((t.value+e*t.step)/t.step)*t.step));i!==t.value&&this.hass.callService("input_number","set_value",{entity_id:t.entity,value:i})}_openMoreInfo(e){e&&this.hass?.states[e]&&be(this,"hass-more-info",{entityId:e})}_svg(){return this.renderRoot.querySelector("svg.dial")}_onPointerDown(e){if("ok"!==je(this._states,this.config))return;const t=this._svg();if(!t)return;const i=t.getBoundingClientRect();if(!i.width)return;if(function(e,t,i,n){const a=Math.hypot(e,t);if(Math.abs(a-Ie*i)>21*i)return!1;let o=Math.abs(Ve(e,t)-n);return o>180&&(o=360-o),o<=22}(e.clientX-(i.left+i.width/2),e.clientY-(i.top+i.height/2),i.width/200,this._valueAngle)){e.preventDefault(),this._dragging=!0,this._dragPointerId=e.pointerId;try{t.setPointerCapture(e.pointerId)}catch(e){}window.addEventListener("pointermove",this._boundMove),window.addEventListener("pointerup",this._boundUp),window.addEventListener("pointercancel",this._boundUp)}}_onPointerMove(e){if(!this._dragging||e.pointerId!==this._dragPointerId)return;e.cancelable&&e.preventDefault();const t=this._svg();if(!t)return;const i=t.getBoundingClientRect(),n=Ve(e.clientX-(i.left+i.width/2),e.clientY-(i.top+i.height/2)),{min:a,max:o,step:r}=tt(this._states,this.config);this._dragTemp=qe(n,a,o,r)}_onPointerUp(e){if(!this._dragging||e.pointerId!==this._dragPointerId)return;if(this._dragging=!1,this._removeWindowListeners(),null!==this._dragPointerId){try{this._svg()?.releasePointerCapture(this._dragPointerId)}catch(e){}this._dragPointerId=null}const t=tt(this._states,this.config),i=He(this._pendingFor(t.entity),t.value,Date.now())??t.value,n=function(e,t,i){return i&&null!==e&&e!==t?e:null}(this._dragTemp,i,"ok"===je(this._states,this.config));null!==n&&this._sendTarget(n),this._dragTemp=null}_removeWindowListeners(){window.removeEventListener("pointermove",this._boundMove),window.removeEventListener("pointerup",this._boundUp),window.removeEventListener("pointercancel",this._boundUp)}};vt.styles=r`
    ha-card {
      position: relative;
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
    /* Mantenimiento vencido: en las esquinas del cuadrado del dial, fuera del arco */
    button.care {
      position: absolute;
      z-index: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      padding: 0;
      border: none;
      background: transparent;
      color: #ffa000;
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
      touch-action: manipulation;
    }
    button.care ha-icon {
      --mdc-icon-size: 18px;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      border: 2px solid #ffa000;
      background: rgba(255, 160, 0, 0.14);
      animation: care-pulse 2.4s ease-in-out infinite;
    }
    .care-label {
      font-size: 0.68rem;
      font-weight: 600;
      line-height: 1;
    }
    .care-chlorine {
      top: 0;
      left: 0;
    }
    .care-filter_rinse {
      top: 0;
      right: 0;
    }
    .care-filter_clean {
      bottom: 0;
      left: 0;
      flex-direction: column-reverse;
    }
    .care-filter_change {
      bottom: 0;
      right: 0;
      flex-direction: column-reverse;
    }
    @keyframes care-pulse {
      0%,
      100% {
        box-shadow: 0 0 0 0 rgba(255, 160, 0, 0.45);
      }
      50% {
        box-shadow: 0 0 0 5px rgba(255, 160, 0, 0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      button.care ha-icon {
        animation: none;
      }
    }
    .care-backdrop {
      position: absolute;
      inset: 0;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      border-radius: var(--ha-card-border-radius, 12px);
      background: rgba(0, 0, 0, 0.55);
    }
    .care-dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      max-width: 280px;
      padding: 18px 16px 14px;
      border-radius: 16px;
      text-align: center;
      background: var(--ha-card-background, var(--card-background-color, #1c1c1e));
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.5);
    }
    .care-dialog > ha-icon {
      --mdc-icon-size: 32px;
      color: #ffa000;
    }
    .care-title {
      font-size: 1.1rem;
      font-weight: 600;
    }
    .care-detail,
    .care-question {
      font-size: 0.9rem;
      color: var(--secondary-text-color);
    }
    .care-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }
    .care-actions button {
      min-width: 96px;
      padding: 8px 14px;
      border-radius: 12px;
      border: 1px solid var(--divider-color, #46494d);
      background: transparent;
      color: var(--primary-text-color);
      font: inherit;
      cursor: pointer;
    }
    .care-actions button.primary {
      border-color: #ffa000;
      background: #ffa000;
      color: #1c1c1c;
      font-weight: 600;
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
    .answer {
      display: flex;
      gap: 6px;
      margin-top: 8px;
    }
    .answer button {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      border: 1px solid var(--divider-color, #444);
      background: var(--secondary-background-color, #2a2a2a);
      color: var(--primary-text-color);
      padding: 6px 4px;
      border-radius: 9px;
      cursor: pointer;
      font-size: 0.85rem;
    }
    .answer button.heat {
      /* Naranja de calor fijo: el --accent es gris con el jacuzzi apagado y parecería desactivado */
      border-color: var(--state-climate-heat-color, #ff8100);
      color: var(--state-climate-heat-color, #ff8100);
    }
    .answer ha-icon {
      --mdc-icon-size: 16px;
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
    .settings {
      margin-top: 8px;
      background: var(--secondary-background-color, #2a2a2a);
      border-radius: 12px;
      padding: 2px 10px;
    }
    .setting {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
    }
    .settings-toggle {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      min-height: 36px;
      padding: 0;
      border: none;
      background: transparent;
      font: inherit;
      font-size: 0.85rem;
      color: var(--secondary-text-color);
      cursor: pointer;
      text-align: left;
    }
    .settings-toggle > ha-icon {
      --mdc-icon-size: 18px;
    }
    .settings-toggle .chevron {
      transition: transform 0.2s ease;
    }
    .settings.open .settings-toggle .chevron {
      transform: rotate(180deg);
    }
    .settings-toggle + .setting,
    .setting + .setting {
      border-top: 1px solid var(--divider-color, rgba(255, 255, 255, 0.08));
    }
    .setting > ha-icon {
      --mdc-icon-size: 18px;
    }
    .setting-label {
      flex: 1;
      color: var(--primary-text-color);
    }
    .setting-sub {
      margin-left: 6px;
      font-size: 0.85em;
      color: var(--secondary-text-color);
    }
    .pill {
      display: flex;
      align-items: center;
      gap: 2px;
      background: var(--card-background-color, #1c1c1c);
      border-radius: 9px;
      padding: 3px;
    }
    .pill-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 26px;
      border: none;
      border-radius: 7px;
      background: transparent;
      color: var(--secondary-text-color);
      cursor: pointer;
    }
    .pill-btn:hover {
      background: var(--secondary-background-color, #2a2a2a);
    }
    .pill-btn ha-icon {
      --mdc-icon-size: 16px;
    }
    .pill-value {
      min-width: 46px;
      text-align: center;
      color: var(--primary-text-color);
      font-variant-numeric: tabular-nums;
    }
    .setting.day {
      min-height: 36px;
      padding-left: 28px;
    }
    .setting.day.off input.ready-time {
      opacity: 0.5;
    }
    .day-label {
      min-width: 56px;
      color: var(--primary-text-color);
    }
    input.ready-time {
      font: inherit;
      color: var(--primary-text-color);
      background: transparent;
      border: none;
      padding: 3px 6px;
      color-scheme: light dark;
      font-variant-numeric: tabular-nums;
    }
  `,e([me({attribute:!1})],vt.prototype,"hass",void 0),e([fe()],vt.prototype,"config",void 0),e([fe()],vt.prototype,"_dragging",void 0),e([fe()],vt.prototype,"_dragTemp",void 0),e([fe()],vt.prototype,"_pending",void 0),e([fe()],vt.prototype,"_pendingEntity",void 0),e([fe()],vt.prototype,"_settingsOpen",void 0),e([fe()],vt.prototype,"_careConfirm",void 0),vt=e([ue(ye)],vt);export{vt as LayZSpaCard};
