describe('INTEGRATION TEST Sandbox-Dom', function() {
	var dom, mainElement;
	beforeEach(function(){
		dom = Object.create(domComponent);
	});


	describe('#setMain', function() {
		beforeEach(function(){
			dom.elem = {};
		});
		it('should be able to set the container', function() {
			expect(dom.elem).to.be.empty;
			dom.setMain('test-sandbox');
			var mainContainer = document.getElementById('test-sandbox');
			expect(dom.elem).to.equal(mainContainer);
		});
	});

	describe('domQueryingMethods', function() {
		beforeEach(function(){
			dom.setMain('test-sandbox');
		});

		describe('#find', function() {
			it('should return a collection of dom elements based on search', function() {
				var expectedFind = dom.elem.querySelectorAll('span');
				var actaulFind = dom.find('span');
				expect(expectedFind.length).to.equal(actaulFind.length);
			});
		});
		describe('#findOne', function() {
			it('should return a collection of dom elements based on search', function() {
				var expectedFind = dom.elem.querySelector('span');
				var actaulFind = dom.findOne('span');
				expect(expectedFind).to.equal(actaulFind);
				
			});
		});
	});

	describe('Dom Events', function() {
		var fn, someValue, touchEvent;
		beforeEach(function(){
			dom.setMain('test-sandbox');
			someValue = 0;
			fn = function(){
					someValue++;
			};

			touchEvent = function(element, eventy){
					Hammer(element).trigger(eventy);
			};
		});

		describe('#addEvent', function() {
			it('should be able to add an event listener', function() {
				var element = document.querySelector('span.clickme');
				dom.addEvent(element, 'click', fn);
				expect(someValue).to.equal(0);
				element.click();
				expect(someValue).to.equal(1);
			});
				
		});

		describe('#removeEvent', function() {
			it('should be able to removeEvent an event listener', function() {
				var avalue = 0;
				var element = document.querySelector('span.clickme');
				
				var handler = function(e) {
					avalue++;
				};
				
				dom.addEvent(element, 'click', handler);
				element.click();
				
				expect(avalue).to.equal(1);
				
				dom.removeEvent(element, 'click', handler);
				element.click();
				expect(avalue).to.equal(1);
			});
		});
		
		describe('addTouchEvent', function() {
			it('should add a touch event to an element', function() {
				var avalue = 0;
				var element = document.querySelector('span.dragOne');
				var handler = function(e) {
					avalue++;
				};
				expect(avalue).to.equal(0);
				dom.addTouchEvent(element, 'swiperight', handler, true);
				touchEvent(element, "swiperight");
				expect(avalue).to.equal(1);
				
			});
		});

		describe('removeTouchEvent', function() {
			it('should remove a touch event to an element', function() {
				var avalue = 0;
				var element = document.querySelector('span.dragOne');
				var handler2 = function(e) {
					avalue++;
				};
				
				expect(avalue).to.equal(0);

				dom.addTouchEvent(element, 'swiperight', handler2, true);
				touchEvent(element, "swiperight");
				expect(avalue).to.equal(1);
				
				dom.removeTouchEvent(element, 'swiperight', handler2);
				touchEvent(element, "swiperight");
				expect(avalue).to.equal(1);				
			});
		});
	});		

});