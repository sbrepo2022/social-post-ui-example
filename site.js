let timerId;
let mousedown = false, pinch = false;

const images_count = 3;
let prev_img = -1;
let start_x = -1;
let go_profile_action = false, go_post_action = false;

const isTouch = () => 'ontouchstart' in document.documentElement;

postBody.addEventListener('click', (e) => {
	window.location = 'post.html';
});

// for PC only

if (! isTouch()) {
	postImgElem.addEventListener('mousedown', mouseDown);

	postImgElem.addEventListener('mousemove', () => {
		if (!pinch) mouseUp();
	});

	postImgElem.addEventListener('mouseup', mouseUp);

	window.addEventListener('mouseup', mouseUp);

	window.addEventListener('mousemove', mouseMove);
}

function mouseMove(e) {
	if (isTouch()) return;

	if (pinch) {
		showCurImg(e.screenX);
	}
}

function mouseDown(e) {
	if (isTouch()) return;
	
	mousedown = true;
	timerId = setTimeout(() => {
		if (mousedown) {
			pinch = true;
			startOverlay(e.screenX);
		}
	}, 250);
}

function mouseUp() {
	if (isTouch()) return;
	
	mousedown = pinch = false;
	stopOverlay();
	clearTimeout(timerId);
}

// for PC end

// for touchscreens only

if (isTouch()) {
	postImgElem.addEventListener('touchstart', touchStart);
	window.addEventListener('touchmove', touchMove);
	window.addEventListener('touchend', touchEnd);
}

function touchStart(e) {
	if (! isTouch()) return;

	mousedown = true;
	timerId = setTimeout(() => {
		if (mousedown) {
			pinch = true;
			startOverlay(e.touches[0].screenX);
		}
	}, 250);
	e.preventDefault();
}

function touchMove(e) {
	if (! isTouch()) return;
	if (pinch) {
		showCurImg(e.touches[0].screenX);
	}
	else {
		touchEnd(e);
	}
}

function touchEnd(e) {
	if (! isTouch()) return;

	mousedown = pinch = false;
	stopOverlay();
	clearTimeout(timerId);
}

// for touchscreens end

function showCurImg(screenX) {
	let cur_img = Math.floor(screenX / (overlayElem.offsetWidth / (images_count + 2)));
	let show_img = cur_img < 1 ? 1 : (cur_img > images_count ? images_count : cur_img);
	if (prev_img !== cur_img) {
		document.querySelectorAll('.overlay .overlay-img').forEach((el) => {
			el.classList.remove('show');
		});
		document.querySelector(`.overlay .overlay-img:nth-child(${show_img})`).classList.add('show');
		document.querySelectorAll('.pills div').forEach((el) => {
			el.classList.remove('current');
		});
		document.querySelector(`.pills div:nth-child(${show_img})`).classList.add('current');

		if (cur_img == 0 || cur_img == images_count + 1) {
			start_x = screenX;
		}
		else {
			start_x = -1;
			goProfilePosition(null);
			goPostPosition(null);
		}

		prev_img = cur_img;
	}
	if (cur_img == 0) {
		goProfilePosition(start_x - screenX);
	}
	if (cur_img == images_count + 1) {
		goPostPosition(screenX - start_x);
	}
}

function startOverlay(screenX) {
	overlayElem.style.display = 'flex';
	setTimeout(() => overlayElem.classList.add('show'), 50);
	showCurImg(screenX);
}

function stopOverlay() {
	overlayElem.classList.remove('show')
	setTimeout(() => overlayElem.style.display = 'none', 300);
	prev_img = cur_x = -1;
	if (go_profile_action) {
		window.location = "profile.html";
	}
	if (go_post_action) {
		window.location = "post.html";
	}
	goProfilePosition(null);
	goPostPosition(null);
}

function goProfilePosition(offset) {
	let needed_offset = 1;
	if (offset == null) {
		offset = 0;
	}
	else {
		needed_offset = overlayElem.offsetWidth / ((images_count + 2) * 2);
	}
	
	if (needed_offset > offset) {
		goProfile.style.transform = `translate(${100 * (offset / needed_offset)}px, -50%)`;
		go_profile_action = false;
		goProfile.classList.remove('active');
	}
	else {
		go_profile_action = true;
		goProfile.classList.add('active');
	}
}

function goPostPosition(offset) {
	let needed_offset = 1;
	if (offset == null) {
		offset = 0;
	}
	else {
		needed_offset = overlayElem.offsetWidth / ((images_count + 2) * 2);
	}

	
	if (needed_offset > offset) {
		goPost.style.transform = `translate(-${100 * (offset / needed_offset)}px, -50%)`;
		go_post_action = false;
		goPost.classList.remove('active');
	}
	else {
		go_post_action = true;
		goPost.classList.add('active');
	}
}