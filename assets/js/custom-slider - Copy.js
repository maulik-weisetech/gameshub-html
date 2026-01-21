$(document).ready(function() {
    const $sliderContainer = $('.blue-card-slider');
    if ($sliderContainer.length === 0) {
        console.log('Slider not found on this page');
        return;
    }

    const $sliderTrack = $('.blue-card-slider .slider-track');
    const $prevBtn = $('#prevBtn');
    const $nextBtn = $('#nextBtn');
    
    if ($sliderTrack.length === 0 || $prevBtn.length === 0 || $nextBtn.length === 0) {
        console.error('Slider elements are missing');
        return;
    }

    let $cards = $('.slide-card');
    if ($cards.length === 0) {
        console.error('No slide cards found');
        return;
    }
    
    const originalCardsCount = $cards.length;
    let currentIndex = 0;
    let isTransitioning = false;
    let totalCards = originalCardsCount;
    let autoplayInterval;
    let sliderActive = false;
    
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    
    function getDimensions() {
        const width = $(window).width();
        if (width <= 639) {
            return { active: 167, inactive: 167, gap: 8 };            
        } else if (width >= 640 && width <= 1024) {
            return { active: 400, inactive: 200, gap: 16 };
        } else {
            return { active: 542, inactive: 275, gap: 24 };
        }
    }
    
    function shouldActivateSlider() {
        const width = $(window).width();
        // On mobile (≤639px), always activate slider
        // On tablet/desktop, only activate if there are 4 or more cards
        if (width <= 639) {
            return true;
        } else {
            return originalCardsCount >= 4;
        }
    }
    
    function setupInfiniteSlider() {
        // Reset to original cards first
        $sliderTrack.empty();
        $cards.slice(0, originalCardsCount).each(function() {
            $sliderTrack.append($(this).clone());
        });
        
        $cards = $('.slide-card');
        
        const $sliderTrackEl = $('.blue-card-slider .slider-track');
        const $originalCards = $cards.clone();
        
        $originalCards.each(function() {
            $sliderTrackEl.append($(this).clone());
        });
        
        $originalCards.get().reverse().forEach(function(card) {
            $sliderTrackEl.prepend($(card).clone());
        });
        
        $cards = $('.slide-card');
        totalCards = originalCardsCount;
        currentIndex = totalCards;
        updateActiveStates();
    }
    
    function deactivateSlider() {
        sliderActive = false;
        stopAutoplay();
        
        // Reset to original cards
        $sliderTrack.empty();
        $cards.slice(0, originalCardsCount).each(function() {
            $sliderTrack.append($(this).clone());
        });
        $cards = $('.slide-card');
        
        // Remove all transforms and transitions
        $sliderTrack.css({
            'transform': 'translateX(0)',
            'transition': 'none'
        });
        
        // Remove active class from all cards
        $cards.removeClass('active');
        
        // Hide controls
        $prevBtn.hide();
        $nextBtn.hide();
        
        // Disable slider interaction
        $sliderContainer.css('cursor', 'default');
        $sliderContainer.off('mousedown touchstart');
    }
    
    function activateSlider() {
        sliderActive = true;
        
        // Show controls
        $prevBtn.show();
        $nextBtn.show();
        
        // Enable slider interaction
        $sliderContainer.css('cursor', 'grab');
        
        // Setup infinite slider
        setupInfiniteSlider();
        updateSlider(false);
        startAutoplay();
        
        // Re-attach event listeners
        attachEventListeners();
    }
    
    function checkAndToggleSlider() {
        const shouldActivate = shouldActivateSlider();
        
        if (shouldActivate && !sliderActive) {
            activateSlider();
        } else if (!shouldActivate && sliderActive) {
            deactivateSlider();
        } else if (!shouldActivate && !sliderActive) {
            deactivateSlider();
        }
    }

    function updateActiveStates() {
        if (!sliderActive) return;
        
        const width = $(window).width();
        const isMobile = width <= 639;
        
        $cards.each(function(index) {
            if (isMobile) {
                $(this).removeClass('active');
            } else {
                const normalizedIndex = index % totalCards;
                const normalizedCurrent = currentIndex % totalCards;
                if (normalizedIndex === normalizedCurrent) {
                    $(this).addClass('active');
                } else {
                    $(this).removeClass('active');
                }
            }
        });
    }

    function calculateOffset() {
        let offset = 0;
        const dims = getDimensions();
        const isMobile = $(window).width() <= 639;
        
        for (let i = 0; i < currentIndex; i++) {
            if (isMobile) {
                offset += dims.inactive + dims.gap;
            } else {
                const normalizedIndex = i % totalCards;
                const normalizedCurrent = currentIndex % totalCards;
                
                if (normalizedIndex === normalizedCurrent) {
                    offset += dims.active + dims.gap;
                } else {
                    offset += dims.inactive + dims.gap;
                }
            }
        }
        return offset;
    }

    function updateSlider(transition = true) {
        if (!sliderActive) return;
        
        updateActiveStates();
        const offset = calculateOffset();
        
        if (transition) {
            $sliderTrack.css('transition', 'transform 0.5s ease-in-out');
        } else {
            $sliderTrack.css('transition', 'none');
        }
        
        $sliderTrack.css('transform', `translateX(-${offset}px)`);
        prevTranslate = -offset;
    }

    function handleInfiniteLoop() {
        if (!sliderActive) return;
        
        if (currentIndex >= totalCards * 2) {
            setTimeout(function() {
                $sliderTrack.css('transition', 'none');
                currentIndex = totalCards;
                updateActiveStates();
                const offset = calculateOffset();
                $sliderTrack.css('transform', `translateX(-${offset}px)`);
                prevTranslate = -offset;
                
                $sliderTrack[0].offsetHeight;
                isTransitioning = false;
            }, 500);
        }
        else if (currentIndex < totalCards) {
            setTimeout(function() {
                $sliderTrack.css('transition', 'none');
                currentIndex = totalCards * 2 - 1;
                updateActiveStates();
                const offset = calculateOffset();
                $sliderTrack.css('transform', `translateX(-${offset}px)`);
                prevTranslate = -offset;
                
                $sliderTrack[0].offsetHeight;
                isTransitioning = false;
            }, 500);
        } else {
            isTransitioning = false;
        }
    }

    function goToNext() {
        if (!sliderActive || isTransitioning) return;
        isTransitioning = true;
        currentIndex++;
        updateSlider(true);
        handleInfiniteLoop();
    }

    function goToPrev() {
        if (!sliderActive || isTransitioning) return;
        isTransitioning = true;
        currentIndex--;
        updateSlider(true);
        handleInfiniteLoop();
    }

    function startAutoplay() {
        if (!sliderActive) return;
        stopAutoplay();
        autoplayInterval = setInterval(function() {
            if (!isDragging) {
                goToNext();
            }
        }, 2000);
    }

    function stopAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            autoplayInterval = null;
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.originalEvent.touches[0].clientX;
    }

    function dragStart(event) {
        if (!sliderActive) return;
        
        if (event.type === 'mousedown') {
            event.preventDefault();
        }
        isDragging = true;
        startPos = getPositionX(event);
        $sliderContainer.addClass('dragging');
        stopAutoplay();
        
        animationID = requestAnimationFrame(animation);
    }

    function dragMove(event) {
        if (!sliderActive || !isDragging) return;
        
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPos;
    }

    function dragEnd() {
        if (!sliderActive || !isDragging) return;
        
        isDragging = false;
        cancelAnimationFrame(animationID);
        $sliderContainer.removeClass('dragging');
        
        const movedBy = currentTranslate - prevTranslate;
        
        if (movedBy < -50) {
            goToNext();
        } else if (movedBy > 50) {
            goToPrev();
        } else {
            updateSlider(true);
            isTransitioning = false;
        }
        
        startAutoplay();
    }

    function animation() {
        if (isDragging) {
            $sliderTrack.css({
                'transition': 'none',
                'transform': `translateX(${currentTranslate}px)`
            });
            requestAnimationFrame(animation);
        }
    }
    
    function attachEventListeners() {
        $nextBtn.off('click').on('click', function() {
            if (!sliderActive) return;
            stopAutoplay();
            goToNext();
            startAutoplay();
        });

        $prevBtn.off('click').on('click', function() {
            if (!sliderActive) return;
            stopAutoplay();
            goToPrev();
            startAutoplay();
        });

        $sliderContainer.off('mousedown').on('mousedown', dragStart);
        $sliderContainer.off('mousemove').on('mousemove', dragMove);
        $sliderContainer.off('mouseup').on('mouseup', dragEnd);
        $sliderContainer.off('mouseleave').on('mouseleave', dragEnd);

        $sliderContainer.off('touchstart').on('touchstart', dragStart);
        $sliderContainer.off('touchmove').on('touchmove', dragMove);
        $sliderContainer.off('touchend').on('touchend', dragEnd);

        $sliderContainer.off('click').on('click', function(e) {
            if (!sliderActive) return;
            if (Math.abs(currentTranslate - prevTranslate) > 5) {
                e.preventDefault();
                e.stopPropagation();
            }
        });

        $sliderContainer.off('mouseenter').on('mouseenter', function() {
            if (sliderActive) stopAutoplay();
        });
        
        $sliderContainer.off('mouseleave').on('mouseleave', function() {
            if (sliderActive && !isDragging) startAutoplay();
        });
    }

    let resizeTimer;
    $(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            checkAndToggleSlider();
            if (sliderActive) {
                updateSlider(false);
            }
        }, 100);
    });

    $(document).on('keydown', function(e) {
        if (!sliderActive) return;
        
        if (e.key === 'ArrowLeft') {
            stopAutoplay();
            goToPrev();
            startAutoplay();
        } else if (e.key === 'ArrowRight') {
            stopAutoplay();
            goToNext();
            startAutoplay();
        }
    });

    // Initialize
    checkAndToggleSlider();

    console.log('Slider initialized successfully. Cards:', originalCardsCount, 'Active:', sliderActive);
});