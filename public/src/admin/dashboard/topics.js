'use strict';

define('admin/dashboard/topics', ['admin/modules/dashboard-line-graph', 'hooks'], (graph, hooks) => {
	const ACP = {};

	ACP.init = () => {
		graph.init({
			set: 'topics',
			dataset: ajaxify.data.dataset,
		}).then(() => {
			hooks.onPage('action:admin.dashboard.updateGraph', ACP.updateTable);
		});
	};

	ACP.updateTable = () => {
		if (window.fetch) {
			const url = `${config.relative_path}/api${ajaxify.data.url}${window.location.search}`;
			fetch(url, { credentials: 'include' })
				.then(handleFetchResponse)
				.catch(handleFetchError);
		}
	};

	function handleFetchResponse(response) {
		if (response.ok) {
			response.json()
				.then(handleJsonPayload)
				.catch(handleJsonError);
		}
	}

	function handleJsonPayload(payload) {
		app.parseAndTranslate(ajaxify.data.template.name, 'topics', payload, updateTableContent);
	}

	function updateTableContent(html) {
		const tbodyEl = document.querySelector('.topics-list tbody');
		tbodyEl.innerHTML = '';
		tbodyEl.append(...html.map((idx, el) => el));
	}

	function handleFetchError(error) {
		console.error('Fetch error:', error);
	}

	function handleJsonError(error) {
		console.error('JSON parsing error:', error);
	}

	return ACP;
});
