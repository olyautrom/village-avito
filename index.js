var aosScript = document.createElement('script');

aosScript.onload = aosScript.onerror = function() {
    if (!Element.prototype.closest) {
        Element.prototype.closest = function (s) {
            var el = this;

            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }

    function scrollToAnimated(to, maxDuration, callback) {
        if (window.innerWidth < 1020) {
            var start = document.documentElement.scrollTop;
            var startDate = +new Date();
            var deltaY = to - start;
            var duration = Math.min(maxDuration, Math.abs(deltaY) / 4);
        
            var linear = function(deltaTime) {
                var timeProgress = deltaTime / duration;
        
                return deltaY * timeProgress;
            };
        
            var animateScroll = function() {
                var currentDate = +new Date();
                var deltaTime = currentDate - startDate;
                var changeY = linear(deltaTime);
        
                document.documentElement.scrollTop = parseInt(start + changeY);
        
                if(deltaTime < duration) {
                    requestAnimationFrame(animateScroll);
                }
                else {
                    document.documentElement.scrollTop = to;
                    callback();
                }
            };
            animateScroll();
        } else {
            setTimeout(callback, 0);
        }
    };

    AOS && AOS.init();

    var inputPaddingWidth = 33;
    var ranges = Array.prototype.slice.call(document.querySelectorAll('.avito-range'));

    ranges.forEach(function(range) {
        var onInput = function() {
            var value = (this.value-this.min)/(this.max-this.min);
            var color = this.closest('.avito-interactive').dataset.color;
    
            this.style.backgroundImage = (
                'linear-gradient(' +
                    'to right,' +
                    color + ' 0%, ' +
                    color + ' calc((100% - ' + inputPaddingWidth * 2 + 'px) * ' + value + ' + ' + inputPaddingWidth + 'px), ' +
                    '#fff calc((100% - ' + inputPaddingWidth * 2 + 'px) * ' + value + ' + ' + inputPaddingWidth + 'px), ' +
                    '#fff 100%' +
                ')'
            );
            this.parentElement.dataset.value = value / 0.25 + 1;
        };

        range.addEventListener('input', onInput);

        var removeOnInputListener = function() {
            range.removeEventListener('input', onInput);
            window.removeEventListener('LOCATION/PATHNAME_CHANGED', removeOnInputListener);
        };

        window.addEventListener('LOCATION/PATHNAME_CHANGED', removeOnInputListener);
    });

    var aboutDescriptions = Array.prototype.slice.call(document.querySelectorAll('.card__description'));

    aboutDescriptions.forEach(function(description) {
        var onScroll = function() {
            var scroller = this.parentElement.querySelector('.scrollbar');
            var scrollerThumb = scroller.querySelector('.scrollbar-thumb');
            var color = this.closest('.avito-interactive').dataset.color;
            var value = this.scrollTop / (this.scrollHeight - this.clientHeight);

            scroller.style.backgroundImage = (
                'linear-gradient(' +
                    'to bottom,' +
                    color + ' 0%, ' +
                    color + ' calc((100% - ' + inputPaddingWidth * 2 + 'px) * ' + value + ' + ' + inputPaddingWidth + 'px), ' +
                    '#fff calc((100% - ' + inputPaddingWidth * 2 + 'px) * ' + value + ' + ' + inputPaddingWidth + 'px), ' +
                    '#fff 100%' +
                ')'
            );
            scrollerThumb.style.top = value * 100 + '%';
        };

        description.addEventListener('scroll', onScroll);

        var removeOnScrollListener = function() {
            description.removeEventListener('scroll', onScroll);
            window.removeEventListener('LOCATION/PATHNAME_CHANGED', removeOnScrollListener);
        };

        window.addEventListener('LOCATION/PATHNAME_CHANGED', removeOnScrollListener);
    });

    var selectPriceButtons = Array.prototype.slice.call(document.querySelectorAll('.avito-btn_select-price'));

    selectPriceButtons.forEach(function(button) {
        var onClick = function() {
            var interactiveRange = this.parentElement;
            var answer = interactiveRange.dataset.answer;
            var rangeResuit = interactiveRange.querySelector('input');
            var result = interactiveRange.querySelector('.interactive__result');
    
            result.innerText = rangeResuit.value === answer ? 'Угадал!' : 'Почти угадал!';
    
            rangeResuit.value = answer;
            rangeResuit.dispatchEvent(new Event('input'));
            rangeResuit.disabled = true;
            interactiveRange.classList.add("range-ending");
        };

        button.addEventListener('click', onClick);

        var removeOnClickListener = function() {
            button.removeEventListener('click', onClick);
            window.removeEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
        };

        window.addEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
    });

    var showAboutButtons = Array.prototype.slice.call(document.querySelectorAll('.avito-btn_show-about'));

    showAboutButtons.forEach(function(button) {
        var onClick = function() {
            var interactive = this.closest('.avito-interactive');
            var interactiveRange = this.parentElement;
            var avitoInteractiveInner = interactiveRange.parentElement;
    
            scrollToAnimated(
                pageYOffset - Math.abs(interactive.getBoundingClientRect().top) - 70,
                500,
                function() {
                    avitoInteractiveInner.classList.add("avito-interactive-inner_hidden");

                    avitoInteractiveInner.parentElement.querySelector('.avito-about-person')
                        .classList.add("avito-about-person_shown");

                    AOS && AOS.refreshHard();
                }
            );
        };

        button.addEventListener('click', onClick);

        var removeOnClickListener = function() {
            button.removeEventListener('click', onClick);
            window.removeEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
        };

        window.addEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
    });
    
    var showNextButtons = Array.prototype.slice.call(document.querySelectorAll('.avito-btn_show-next'));

    showNextButtons.forEach(function(button) {
        var onClick = function() {
            var interactive = this.closest('.avito-interactive');

            scrollToAnimated(
                pageYOffset - Math.abs(interactive.getBoundingClientRect().top) - 70,
                500,
                function() {
                    interactive.classList.add('avito-interactive_hidden');
                    interactive.style.zIndex = -1;
                    AOS && AOS.refreshHard();
                }
            );
        };

        button.addEventListener('click', onClick);

        var removeOnClickListener = function() {
            button.removeEventListener('click', onClick);
            window.removeEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
        };

        window.addEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
    });

    var resetButton = document.querySelector('.avito-btn_restart');
    var onResetClick = function() {
        var interactive = this.closest('.avito-interactive');
        scrollToAnimated(
            pageYOffset - Math.abs(interactive.getBoundingClientRect().top) - 70,
            500,
            function() {
                Array.prototype.slice.call(document.querySelectorAll('.avito-interactive')).forEach(function(elem) {
                    elem.removeAttribute('style');
                    elem.classList.remove('avito-interactive_hidden');
                });

                Array.prototype.slice.call(document.querySelectorAll('.avito-interactive-inner')).forEach(function(elem) {
                    elem.classList.remove('avito-interactive-inner_hidden');
                });

                Array.prototype.slice.call(document.querySelectorAll('.avito-about-person')).forEach(function(elem) {
                    elem.classList.remove('avito-about-person_shown');
                });

                Array.prototype.slice.call(document.querySelectorAll('.card__description')).forEach(function(elem) {
                    elem.scrollTop = 0;
                });

                Array.prototype.slice.call(document.querySelectorAll('.avito-range')).forEach(function(elem) {
                    elem.value = elem.getAttribute('value');
                    elem.disabled = false;
                    elem.dispatchEvent(new Event('input'));
                });

                Array.prototype.slice.call(document.querySelectorAll('.interactive__range')).forEach(function(elem) {
                    elem.classList.remove('range-ending');
                });

                AOS && AOS.refreshHard();
            }
        );
    };

    resetButton.addEventListener('click', onResetClick);

    var removeOnClickListener = function() {
        resetButton.removeEventListener('click', onClick);
        window.removeEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
    };

    window.addEventListener('LOCATION/PATHNAME_CHANGED', removeOnClickListener);
};

aosScript.src = "https://unpkg.com/aos@2.3.1/dist/aos.js";
document.body.appendChild(aosScript);