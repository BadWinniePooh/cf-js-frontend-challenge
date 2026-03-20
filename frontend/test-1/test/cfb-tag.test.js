import { CfbTag } from '../../step-1/cfb-tag.js'
import { expect } from '@esm-bundle/chai'
import { fixture, cleanup } from './helpers/fixture.js'

if (!customElements.get('cfb-tag')) {
  customElements.define('cfb-tag', CfbTag)
}

afterEach(cleanup)

describe('<cfb-tag>', () => {
  describe('rendering', () => {
    it('renders the default name attribute', async () => {
      const element = await fixture('<cfb-tag></cfb-tag>');
      const span = element.querySelector('.cfb-tag');
      expect(span).to.exist;
      expect(span.textContent).to.equal('Default');
    });

    it('renders the label attribute', async () => {
      const element = await fixture('<cfb-tag data-label="Test"></cfb-tag>');
      const span = element.querySelector('.cfb-tag');
      expect(span).to.exist;
      expect(span.textContent).to.equal('Test');
    });

    it('renders the color attribute', async () => {
      const element = await fixture('<cfb-tag data-color="red"></cfb-tag>');
      const span = element.querySelector('.cfb-tag');
      expect(span).to.exist;
      expect(span.classList.contains('cfb-tag--red')).to.be.true;
    });

    it('renders the count attribute', async () => {
      const element = await fixture('<cfb-tag data-count="5"></cfb-tag>');
      const span = element.querySelector('.cfb-tag');
      expect(span).to.exist;
      expect(span.textContent).to.equal('Default x5');
    });
  })

  describe('attribute reactivity', () => {
    it('updates the label when the data-label attribute changes', async () => {
      const element = await fixture('<cfb-tag></cfb-tag>');
      
      element.setAttribute('data-label', 'Updated');

      expect(element.querySelector('.cfb-tag').textContent).to.equal('Updated');
    });

    it('updates the color when the data-color attribute changes', async () => {
      const element = await fixture('<cfb-tag></cfb-tag>');
      element.setAttribute('data-color', 'blue');

      expect(element.querySelector('.cfb-tag').classList.contains('cfb-tag--blue')).to.be.true;
    });

    it('updates the count when the data-count attribute changes', async () => {
      const element = await fixture('<cfb-tag></cfb-tag>');
      element.setAttribute('data-count', '10');

      expect(element.querySelector('.cfb-tag').textContent).to.equal('Default x10');
    });

  })
})
