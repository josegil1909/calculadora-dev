import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import UiButton from '../src/components/UiButton.vue';

// Minimal mount helper (no global plugins required)

describe('UiButton', () => {
  it('renders slot content', () => {
    const wrapper = mount(UiButton, { slots: { default: 'Click' } });
    expect(wrapper.text()).toContain('Click');
  });

  it('emits click', async () => {
    const wrapper = mount(UiButton, { slots: { default: 'Go' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted().click).toBeTruthy();
  });

  it('disabled state prevents click emit', async () => {
    const wrapper = mount(UiButton, { props: { disabled: true }, slots: { default: 'X' } });
    await wrapper.trigger('click');
    expect(wrapper.emitted().click).toBeFalsy();
  });

  it('applies variant classes', () => {
    const wrapper = mount(UiButton, { props: { variant: 'primary' }, slots: { default: 'P' } });
    expect(wrapper.classes().join(' ')).toMatch(/btn-primary/);
  });
});
