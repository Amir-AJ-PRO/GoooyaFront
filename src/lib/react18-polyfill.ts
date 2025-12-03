/**
 * Polyfill برای findDOMNode در React 18
 * این polyfill برای سازگاری با react-quill که از findDOMNode استفاده می‌کند، اضافه شده است
 */

if (typeof window !== 'undefined') {
  // اضافه کردن polyfill به ReactDOM قبل از import react-quill
  const ReactDOM = require('react-dom');
  
  if (ReactDOM && !ReactDOM.findDOMNode) {
    (ReactDOM as any).findDOMNode = function(instance: any): Element | Text | null {
      if (instance == null) {
        return null;
      }
      
      // اگر instance خودش یک DOM node است
      if (instance.nodeType === 1 || instance.nodeType === 3) {
        return instance;
      }
      
      // اگر instance یک ref object است
      if (instance && typeof instance === 'object' && 'current' in instance) {
        return instance.current;
      }
      
      // برای class components - جستجو در refs
      if (instance && typeof instance.render === 'function') {
        // تلاش برای پیدا کردن ref از طریق internal fiber (React 16/17)
        const fiber = (instance as any)._reactInternalFiber || (instance as any)._reactInternalInstance;
        if (fiber) {
          const ref = fiber.ref;
          if (ref) {
            if (typeof ref === 'function') {
              // ref callback - نمی‌توانیم node را مستقیماً برگردانیم
              return null;
            }
            if (ref && ref.current) {
              return ref.current;
            }
          }
        }
        
        // جستجو در refs object
        if ((instance as any).refs) {
          const refs = (instance as any).refs;
          for (const key in refs) {
            if (refs[key]) {
              if (refs[key].nodeType) {
                return refs[key];
              }
              if (refs[key].current && refs[key].current.nodeType) {
                return refs[key].current;
              }
            }
          }
        }
      }
      
      // Fallback: جستجو در DOM برای quill container (آخرین راه‌حل)
      // این فقط برای react-quill استفاده می‌شود
      try {
        const quillContainer = document.querySelector('.quill, .ql-container, .ql-editor');
        if (quillContainer) {
          return quillContainer as Element;
        }
      } catch (e) {
        // ignore
      }
      
      return null;
    };
  }
  
  // همچنین اضافه کردن به default export اگر وجود دارد
  if (ReactDOM.default && !ReactDOM.default.findDOMNode) {
    ReactDOM.default.findDOMNode = (ReactDOM as any).findDOMNode;
  }
}

export {};

