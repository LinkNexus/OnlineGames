import { startStimulusApp, registerControllers } from "vite-plugin-symfony/stimulus/helpers";
import { registerReactControllerComponents } from "vite-plugin-symfony/stimulus/helpers/react"

registerReactControllerComponents(import.meta.glob('./react/controllers/**/*.ts(x)\?'));

const app = startStimulusApp();
registerControllers(
    app,
    import.meta.glob<StimulusControllerInfosImport>(
        "./controllers/*_controller.ts",
        {
            query: "?stimulus",
            /**
             * always true, the `lazy` behavior is managed internally with
             * import.meta.stimulusFetch (see reference)
             */
            eager: true,
        },
    ),
);