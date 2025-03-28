import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		{
			name: 'md-reload',
			configureServer(server) {
				server.watcher.add('src/posts/**/*.md');
				server.watcher.on('change', (path) => {
					if (path.endsWith('.md')) {
						server.config.logger.info(`file changed: ${path}`, {
							timestamp: true,
							clear: false
						});
						
						server.ws.send({ type: 'full-reload' });
					}
				});
			}
		}
	]
});
