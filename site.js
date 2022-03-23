let timerId;
let mousedown = false, pinch = false;

const images_count = 3;
let prev_img = -1;
let start_x = -1;
let go_profile_action = false, go_post_action = false;

window.oncontextmenu = function(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
};

postImgElem.addEventListener('mouseover', (e) => {
	e.stopPropagation();
});

postCard.addEventListener('click', (e) => {
	window.location = 'post.html';
});

postImgElem.addEventListener('mousedown', touchstart);

postImgElem.addEventListener('mousemove', () => {
	if (!pinch) touchend();
});

postImgElem.addEventListener('mouseup', touchend);

window.addEventListener('mouseup', touchend);

window.addEventListener('mousemove', (e) => {
	if (pinch) {
		showCurImg(e);
	}
});

function touchstart(e) {
	mousedown = true;
	timerId = setTimeout(() => {
		if (mousedown) {
			pinch = true;
			startOverlay(e);
		}
	}, 250);
}

function touchend() {
	mousedown = pinch = false;
	stopOverlay();
	clearTimeout(timerId);
}

function showCurImg(e) {
	let cur_img = Math.floor(e.screenX / (overlayElem.offsetWidth / (images_count + 2)));
	let show_img = cur_img < 1 ? 1 : (cur_img > images_count ? images_count : cur_img);
	if (prev_img !== cur_img) {
		document.querySelectorAll('.overlay img').forEach((el) => {
			el.classList.remove('show');
		});
		document.querySelector(`.overlay img:nth-child(${show_img})`).classList.add('show');
		document.querySelectorAll('.pills div').forEach((el) => {
			el.classList.remove('current');
		});
		document.querySelector(`.pills div:nth-child(${show_img})`).classList.add('current');

		if (cur_img == 0 || cur_img == images_count + 1) {
			start_x = e.screenX;
		}
		else {
			start_x = -1;
			goProfilePosition(null);
			goPostPosition(null);
		}

		prev_img = cur_img;
	}
	if (cur_img == 0) {
		goProfilePosition(start_x - e.screenX);
	}
	if (cur_img == images_count + 1) {
		goPostPosition(e.screenX - start_x);
	}
}

function startOverlay(e) {
	overlayElem.style.display = 'flex';
	setTimeout(() => overlayElem.classList.add('show'), 50);
	showCurImg(e);
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