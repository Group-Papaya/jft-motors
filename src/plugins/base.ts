import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";
import Vue from "vue";

const requireComponent = require.context(
  "@/components/material/",
  true,
  /\.vue$/
);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\//, "").replace(/\.\w+$/, ""))
  );

  Vue.component(
    `App${componentName}`,
    componentConfig.default || componentConfig
  );
});
