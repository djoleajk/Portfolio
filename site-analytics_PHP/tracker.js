
const config = window.analyticsConfig || { websiteId: 1, apiKey: "test123api" };

function getReferrerDomain(referrer) {
	if (!referrer) return "direct";
	try {
		const url = new URL(referrer);
		return url.hostname;
	} catch (e) {
		return "invalid";
	}
}

function getSearchData(referrer) {
	try {
		const url = new URL(referrer);
		const searchEngines = {
			google: {
				domains: ["google.com", "google.co.uk", "google.rs"],
				param: "q",
			},
			bing: { domains: ["bing.com"], param: "q" },
			yahoo: { domains: ["yahoo.com"], param: "p" },
			yandex: { domains: ["yandex.com", "yandex.ru"], param: "text" },
		};

		for (const [engine, config] of Object.entries(searchEngines)) {
			if (config.domains.some((domain) => url.hostname.includes(domain))) {
				const term = new URLSearchParams(url.search).get(config.param);
				if (term) return { engine, term: decodeURIComponent(term) };
			}
		}
	} catch (e) {
		console.error("Search parsing error:", e);
	}
	return null;
}

function trackPageView() {
	const searchData = getSearchData(document.referrer);
	const data = {
		website_id: window.analyticsConfig.websiteId,
		url: window.location.href,
		referrer: document.referrer,
		user_agent: navigator.userAgent,
		search_data: searchData,
		screen_size: `${window.screen.width}x${window.screen.height}`,
		timestamp: new Date().toISOString(),
	};

	fetch("/PORTFOLIO/site-analytics/api/track.php", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-API-Key": window.analyticsConfig.apiKey,
		},
		body: JSON.stringify(data),
	});
}

function trackEvent(category, action, label) {
	const data = {
		website_id: config.websiteId,
		event_category: category,
		event_action: action,
		event_label: label,
		timestamp: new Date().toISOString(),
	};

	sendToServer("track_event.php", data);
}

function sendToServer(endpoint, data) {
	fetch(`api/${endpoint}`, {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			"X-API-Key": config.apiKey,
		},
	}).catch((error) => console.error("Analytics error:", error));
}

document.addEventListener("DOMContentLoaded", trackPageView);
