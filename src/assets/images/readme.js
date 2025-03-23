const paths = {
    packaged: {
        componentTemplates: {
            renderer_asReactElement: "import MyComponent from 'assets/componentTemplates/myComponent.svg'",
            renderer_asRawSvg: "import { ReactComponent as MyComponent } from 'assets/componentTemplates/myComponent.svg'",
            mainProcess_templateComponentProjectUpdater: "path.join(__dirname, 'assets', 'images', 'componentTemplates', 'myComponent.svg')",
        }
    },
    dev: {
        componentTemplates: {
            renderer_asReactElement: "import MyComponent from '../../assets/images/componentTemplates/myComponent.svg'",
            renderer_asRawSvg: "import { ReactComponent as MyComponent } from '../../assets/images/componentTemplates/myComponent.svg'",
            mainProcess_templateComponentProjectUpdater: "path.join(__dirname, '..', '..', 'assets', 'images', 'componentTemplates', 'myComponent.svg')",
            testTemplative_templateComponentProjectUpdater: "path.join(process.cwd(), 'src', 'assets', 'images', 'componentTemplates', 'myComponent.svg')",
        }
    }
}

/**
 * Asset Usage Guide:
 * 
 * 1. Component Preview Images (PNGs):
 *    - Located in: ./src/assets/images/componentPreviewImages
 *    - Copied to: .webpack/renderer/assets/componentPreviewImages by webpack.renderer.config.js
 *    - Also included as extraResource in forge.config.js for packaged app
 *    - Access in renderer: import previewImage from 'assets/componentPreviewImages/myComponent.png'
 * 
 * 2. Component Templates (SVGs):
 *    - Located in: ./src/assets/images/componentTemplates
 *    - Copied to both main and renderer processes by respective webpack configs
 *    - Also included as extraResource in forge.config.js for packaged app
 *    - In renderer: SVGs are processed by @svgr/webpack to be usable as React components
 *    - In main process: SVGs are copied as-is and can be accessed via path
 * 
 * 3. Usage Examples:
 *    - Renderer (React component): 
 *      import MyIcon from 'assets/componentTemplates/myIcon.svg'
 *      <MyIcon width={24} height={24} />
 * 
 *    - Main process (file access):
 *      const svgPath = path.join(__dirname, 'assets', 'images', 'componentTemplates', 'myTemplate.svg')
 *      const svgContent = fs.readFileSync(svgPath, 'utf8')
 * 
 *    - Test scripts:
 *      const svgPath = path.join(process.cwd(), 'src', 'assets', 'images', 'componentTemplates', 'myTemplate.svg')
 *      const svgContent = fs.readFileSync(svgPath, 'utf8')
 */

module.exports = paths;