import {
  getDefaultThemeCss,
  getThemeBootstrapScript,
} from '@/themes/themeBootstrap';

export function ThemeScript() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: getDefaultThemeCss() }} />
      <script dangerouslySetInnerHTML={{ __html: getThemeBootstrapScript() }} />
    </>
  );
}
