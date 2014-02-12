//(function($){
jQuery(document).ready(function($){
		var DateControlModel = Backbone.Model.extend({
			defaults: function(){
				return {
					startDate: "01/01/" + new Date().getFullYear(),
					endDate: "12/31/" + new Date().getFullYear()
				}
			},
			getMySQLDates: function(dates){
				var startDates, endDates;
				if(!arguments[0]){
					startDates = this.get('startDate').split("/");
					endDates = this.get('endDate').split("/");
				} else{
					startDates = dates.startDate.split("/");
					endDates = dates.endDate.split("/");
				}
				return {
					startDate: startDates[2] + "-" + startDates[0] + "-" + startDates[1],
					endDate: endDates[2] + "-" + endDates[0] + "-" + endDates[1]
				}
			},
			setToday: function(){
				var today = new Date();
				this.set('startDate', (today.getMonth()+1) + "/" + today.getDate() + "/" +today.getFullYear());
				this.set('endDate', (today.getMonth() + 1) + "/" + (today.getDate() + 1) + "/" +today.getFullYear())
			},
			minusOneDate: function(date){
				var theDate = new Date(date);
				theDate.setDate(theDate.getDate() -1);
				return theDate;
			},
			toJQueryDate: function(date){
				return (date.getMonth()+1) + "/" + date.getDate() + "/" +date.getFullYear();
			},
			getMinusDates: function(dates){
				if(!dates){
					var dates = {
						startDate: this.get('startDate'),
						endDate: this.get('endDate')
					};
				}
				return{
					startDate: this.toJQueryDate(this.minusOneDate(dates.startDate)),
					endDate: this.toJQueryDate(this.minusOneDate(dates.endDate))
				}
			}
		});


		var DateControlView = Backbone.View.extend({
			el: '#date-control',
			model: new DateControlModel(),
			events: {
				'click #report': 'triggerReport',
				'change #startDate': 'setDate',
				'change #endDate': 'setDate'
			},

			initialize: function(){
				this.template = _.template($('#date-control-template').html());
				this.listenTo(this.model, 'change', this.render);
				this.render();
			},
			render: function(){
				this.$el.html(this.template(this.model.toJSON()));
				$('#startDate').datepicker();
				$('#endDate').datepicker();
				return this;
			},
			triggerReport: function(e){
				e.preventDefault();
				this.trigger('report', this.model);
			},
			setDate: function(e){
				this.model.set('startDate', $('#startDate').val())
				this.model.set('endDate', $('#endDate').val())
			}
		})


		var CommentReportView = Backbone.View.extend({
			el: '#comment-reporting',
			template: _.template(jQuery('#comment-reporting-template').html()),
			initialize: function(){
				this.render();
				this.dateControl = new DateControlView();
				this.commentReportAreaView = new CommentReportAreaView({
					dateControl: this.dateControl
				});
			},
			render: function(){
				this.$el.html(this.template());
				return this;
			}
		})

		var CommentReportAreaView = Backbone.View.extend({
			el: '#comment-report-area',
			template: _.template($('#comment-report-area-template').html()),
			initialize: function(opts){
				var self = this;
				this.collection = new CommentReportCollection();
				this.dateControl = opts.dateControl;
				this.listenTo(opts.dateControl, 'report', function(){
					self.reportStuff();
				});
/*				this.collection.fetch()
				.done(function(data, status, headers){
					
				})
				.fail(function(data, status, headers){
					//halp
				})*/
			},
			render: function(){
				this.$el.html(this.template());
				var insertable = $('<tbody></tbody>');
				_.each(this.collection.models, function(elem, index, list){
					var view = new CommentReportModelView({
						model: elem
					});
					insertable.append(view.render().el);
				})
				this.$el.find('tbody').replaceWith(insertable);
				return this;
			},
			reportStuff: function(){
				var dateParams = {data: $.param(this.dateControl.model.getMySQLDates()), validate: true, reset: true};
				var self = this;
				this.collection.fetch(dateParams)
				.done(function(){
					self.render();
					new CommentReportTotalView({dateParams: dateParams});
				})
				.fail(function(){
					console.log('err');
				})
			}
		});

		var CommentReportModel = Backbone.Model.extend({

		});
		var CommentReportCollection = Backbone.Collection.extend({
			model: CommentReportModel,
			url: '/wp-content/plugins/passport-comment-reporting/comments_controller.php',
			initialize: function(mdls, opts){

			}
		})


		var CommentReportModelView = Backbone.View.extend({
			tagName: 'tr',
			template: _.template($('#comment-report-model-template').html()),
			initialize: function(){
				this.render();
			},
			render: function(){
				this.$el.html(this.template(this.model.toJSON()));
				return this;
			}
		});





		var CommentReportTotalModel = Backbone.Model.extend({
			urlRoot: '/wp-content/plugins/passport-comment-reporting/comments_controller.php?report=total'
		})

		var CommentReportTotalView = Backbone.View.extend({
			el: '#comment-report--total-area',
			initialize: function(opts){
				console.log(opts);
			},
			render: function(){
				return this;
			}
		})
		var crv = new CommentReportView();

		
	})
//})(jQuery)
	
