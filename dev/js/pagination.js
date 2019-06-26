function pagination(container_id, content_id) {
	var container = document.getElementById(container_id);
	var content = document.getElementById(content_id);
	var sections = content.getElementsByTagName('section');

	var nav = document.createElement('nav');
	nav.id = 'pagination';
	nav.classList.add('pagination');
	for (var elem, i = 0; i < sections.length; i++) {
		elem = document.createElement('div');
		elem.classList.add('pagination__bullet');
		elem.id = 'pagination_section-' + i;
		elem.addEventListener("click", paginationBulletOnClick.bind(elem));
		nav.appendChild(elem);
	}
	var active = nav.getElementsByTagName('div')[0];
	active.classList.add('pagination__bullet_active');

	container.appendChild(nav);



	function paginationBulletOnClick() {
		document.getElementsByClassName('pagination__bullet_active')[0]
			.classList.toggle('pagination__bullet_active');
		this.classList.add('pagination__bullet_active');
	};
};
