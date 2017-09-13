function MessageHandler(context, event) {
    if(event.message.toLowerCase().includes("google")){
        var google = require('googleapis');
        var drive = google.drive('v3');
        var sheets = google.sheets('v4');
        var key = require('./key.json');
        var jwtClient = new google.auth.JWT(key.client_email,null,key.private_key,['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/drive'],null);

        jwtClient.authorize(function (err, tokens) {
        if (err) {
            context.sendResponse(err);
        return;
        }
        var request = {spreadsheetId: '1UabvmyluWC1zlhw7TlSOIhwonxGy2AAFj2iQg91DDE4',range: ['A2'],valueInputOption: 'RAW',resource: {"range": "A2","majorDimension": "ROWS","values": [["Test1"]],},auth: jwtClient,};
        // Make an authorized request to list Drive files.
        sheets.spreadsheets.values.update(request, function(err, response) {
        context.sendResponse(JSON.stringify(response, null, 2)+err);
        });
    });
    }else if(event.senderobj.channeltype=="fb" && context.simpledb.roomleveldata.leaddata > 0){
        if(context.simpledb.roomleveldata.leaddata == 1){
            context.simpledb.roomleveldata.leadclient = event.message;
            context.simpledb.roomleveldata.leaddata = parseInt(context.simpledb.roomleveldata.leaddata)+ 1;
            context.sendResponse("Gracias, ahora dime cual es el nombre de la oportunidad?");return;
        }else if(context.simpledb.roomleveldata.leaddata == 2){
            context.simpledb.roomleveldata.leadopp = event.message;
            context.simpledb.roomleveldata.leaddata = parseInt(context.simpledb.roomleveldata.leaddata)+ 1;
            var region = {"type": "quick_reply","content": {"type": "text","text": "Gracias, en que región se encuentra el cliente?"},"msgid": "region_001","options": ["Argentina", "Caribe", "NA", "Chile", "Colombia", "Ecuador", "Centro América", "México", "Panamá", "Perú", "Venezuela"]};
            context.sendResponse(JSON.stringify(region));return;
        }else if(context.simpledb.roomleveldata.leaddata == 3){
            context.simpledb.roomleveldata.leadregion = event.message;
            context.simpledb.roomleveldata.leaddata = parseInt(context.simpledb.roomleveldata.leaddata)+ 1;
            var cuso = {"type": "quick_reply","content": {"type": "text","text": "Gracias, una última pregunta cual es al caso de uso? puedes elegir una opción o escribirlo"},"msgid": "vertical_001","options": ["Atención al cliente", "Ventas", "Información general", "Registro de oportunidades", "", "Registro de citas", "Estado de productos","No se sabe aún"]};
            context.sendResponse(JSON.stringify(cuso));return;
        }else if(context.simpledb.roomleveldata.leaddata == 4){
            context.simpledb.roomleveldata.leacuso = event.message;
            context.simpledb.roomleveldata.leaddata = parseInt(context.simpledb.roomleveldata.leaddata)+ 1;
            var confirmar = {"type": "quick_reply","content": {"type": "text","text": "Gracias, para confirmar, ¿quieres registrar un lead en "+context.simpledb.roomleveldata.leadregion+" para el cliente "+context.simpledb.roomleveldata.leadclient+" el nombre de la oportunidad es "+context.simpledb.roomleveldata.leadopp+" y el caso de uso "+context.simpledb.roomleveldata.leacuso+"?"},"msgid": "conf_001","options": ["Si", "No"]};
            context.sendResponse(JSON.stringify(confirmar));return;
        }else if(context.simpledb.roomleveldata.leaddata == 5){
            if(event.message.toLowerCase().includes("si")){
                context.simpledb.roomleveldata.leaddata = "";
                var google = require('googleapis');
        		var drive = google.drive('v3');
        		var sheets = google.sheets('v4');
        		var key = require('./key.json');
        		var jwtClient = new google.auth.JWT(key.client_email,null,key.private_key,['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/drive'],null);
        		jwtClient.authorize(function (err, tokens) {
        		if (err) {
            		context.console.log(JSON.stringify(err, null, 2));
            		context.sendResponse("Ups, tuve un problema de autenticación, lo siento ya lo reporté y será resuelto pronto");
        		return;
        		}
        		var request = {spreadsheetId: '1ufA7nCyc606dym84ERSQQf03Wab7EaawyRQLDg-iRSg',range: ['A2'],valueInputOption: 'RAW',resource: {"range": "A2","majorDimension": "ROWS","values": [[event.senderobj.display,context.simpledb.roomleveldata.leadregion,context.simpledb.roomleveldata.leadclient,context.simpledb.roomleveldata.leadopp,context.simpledb.roomleveldata.leacuso]],},auth: jwtClient,};
        		// Make an authorized request to list Drive files.
        		sheets.spreadsheets.values.update(request, function(err, response) {
        		if (err) {
            		context.console.log(JSON.stringify(err, null, 2));
            		context.sendResponse("Ups, tuve un problema al almacenando los datos, lo siento ya lo reporté y será resuelto pronto");
        		return;
        		}
        		context.console.log(JSON.stringify(response, null, 2));
        		context.sendResponse("Gracias "+ event.senderobj.display.split(" ", 2)[0] +"! el Lead ha sido almacenado");
        		});
    			});
                return;
            }else if(event.message.toLowerCase().includes("no")){
                context.simpledb.roomleveldata.leaddata = "";
                context.sendResponse("Bueno, puedes iniciar de nuevo escribiendo la palabra Lead o consultarme algo más");
                return;
            }else {
                context.sendResponse("Disculpa "+ event.senderobj.display.split(" ", 2)[0] +" debes responder si o no");return;
            }
        }
    }else {
    var xsolu = {"type": "quick_reply","content": {"type": "text","text": "¿Estás interesado en nuestra oferta? Ofrecemos soluciones altamente innovadoras, como:"},"msgid": "solu_001","options": ["Chatbots", "Quality of Experience", "CLAcloud", "Otras Soluciones"]};
    var wsolu = {"type": "quick_reply","content": {"type": "text","text": "Gracias por tu interés en nuestras soluciones, cual categoría te interesa?"},"msgid": "solu_002","options": ["Conectividad de red","Optimización de red","Data Center","Seguridad de red","Aplicaciones"]};
    var ysolu = {"type": "quick_reply","content": {"type": "text","text": "Estas son algunas de nuestas Soluciones:"},"msgid": "qr_212","options": ["Networkig", "Datacenter", "Seguridad", "Aplicaciones"]};
    var zsolu = {"type": "quick_reply","content": {"type": "text","text": "¿Puedo ayudarte en algo más? Deseas:"},"msgid": "qr_213","options": ["Nuestras soluciones", "Nuestros servicios", "Contactarnos", "Ver ubicaciones", "Trabajar con nosotros"]};
    var xresp = {"type": "quick_reply","content": {"type": "text","text": "¿Desea que le enviemos una cotización de renovación?"},"msgid": "resp_001","options": ["Sí", "No"]};
    var yresp = {"type": "quick_reply","content": {"type": "text","text": "¿Quieres trabajar con nosotros?"},"msgid": "resp_002","options": ["Sí", "No"]};
    var xserv = {"type": "quick_reply","content": {"type": "text","text": "¿Quieres trabajar con nosotros?"},"msgid": "resp_003","options": ["Sí", "No"]};
    var yserv = {"type": "quick_reply","content": {"type": "text","text": "Gracias por tu interés en nuestros servicios, tenemos varias categorías cual te interesa?"},"msgid": "qr_002","options": ["Servicios Administrados","Servicios Profesionales","Servicios Logísticos","Servicios SDN/NFV","Servicios Locales","Soporte Técnico"]};
    var xubic = {"type": "quick_reply","content": {"type": "text","text": "¿En qué país te encuentras?"},"msgid": "ubic_001","options": ["Argentina", "Caribe", "Chile", "Colombia", "Ecuador", "Guatemala", "México", "Panamá", "Perú", "Venezuela"]};
    var yubic = {"type": "quick_reply","content": {"type": "text","text": "¿En qué país te encuentras?"},"msgid": "ubic_002","options": ["Argentina", "Chile", "Colombia", "Ecuador", "Estados Unidos", "Guatemala", "México", "Panamá", "Perú", "Venezuela"]};
    var xsalu = {"type": "quick_reply","content": {"type": "text","text": "Hola!!, Soy el Chatbot de CLAdirect. Fui programado para ayudarte a contactarnos y solventar tus dudas. ¿Cómo podemos ayudarte? Quieres ver:"},"msgid": "salu_001","options": ["Nuestras soluciones", "Nuestros servicios", "Contactarnos", "Ver ubicaciones", "Trabajar con nosotros"]};
    var xdefault = {"type": "quick_reply","content": {"type": "text","text": "Disculpa no entiendo lo que me dices ahora, aún estoy aprendiendo, te gustaría ver:"},"msgid": "salu_001","options": ["Nuestras soluciones", "Nuestros servicios", "Contactarnos", "Ver ubicaciones", "Trabajar con nosotros"]};
    var cat_sopr = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_002","items": [{"title": "CTAC","subtitle": "Por favor, abre un ticket en nuestra plataforma de atención","imgurl": "http://cladirect.com/wp-content/uploads/2015/04/tech-1.jpg","options": [{"type": "url", "title": "CTAC", "url": "http://tac.cladirect.com/sr/portal/login.php"}]}]};    
    
    var cat_chat = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_004","items": [{"title": "Chatbots","subtitle": "Brindar información relevante al cliente que ayudará a aumentar la satisfacción, a un costo mucho menor a los modelos tradicionales.","imgurl": "http://cladirect.com/wp-content/uploads/2017/img_CLAdirectChatbot_chatbot.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/cladirect-chatbots/"}]}]};
  	var cat_qoex = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_005","items": [{"title": "Quality of Experience","subtitle": "CLAdirect tiene a su disposición tecnología sumamente innovadora que permite tener una medición perceptual de la calidad de la experiencia del usuario. Todo esto a través de robots de última generación que se dedican a medir la calidad, la disponibilidad y la funcionalidad de los servicios entregados.","imgurl": "http://cladirect.com/wp-content/uploads/2017/img_QoE_chatbot.png",/**"options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/2017/02/14/cladirect-witbe-tecnologias-de-calidad-de-experiencia-para-america-latina-y-el-caribe/"}]**/}]};
  	var cat_clac = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_006","items": [{"title": "CLAcloud","subtitle": "En CLAdirect brindamos un innovador conjunto de productos y servicios cloud administrado, a nivel empresarial, con un manejo local y soporte técnico en su idioma, además de un sevicio de migración para llevar a la nube toda la plataforma de TI de su empresa","imgurl": "http://cladirect.com/wp-content/uploads/2017/img_CLAcloud_chatbot.png","options": [{"type": "url", "title": "CTAC", "url": "http://tac.cladirect.com/sr/portal/login.php"}]}]};
    
    
    var cat_conc = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_007","items": [{"title": "Conectividad de Red","subtitle": "Alcance objetivos de alto desempeño para su negocio, con los nuevos niveles de disponibilidad, seguridad y simplicidad operativa para su red","imgurl": "http://cladirect.com/wp-content/uploads/bfi_thumb/Foto2-32zm4ztkntidn69e9oyyo0.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/conectividad-de-red-2/"}]}]};
  	var cat_opti = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_008","items": [{"title": "Optimización de Red","subtitle": "Garantice el mejor desempeño de su red y la máxima calidad de experiencia a sus usuarios. ","imgurl": "http://cladirect.com/wp-content/uploads/bfi_thumb/Foto31-32zm4ztkntidn69e9oyyo0.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/optimizacion-de-red/"}]}]};
  	var cat_segu = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_009","items": [{"title": "Seguridad de Red","subtitle": "Proporcionamos una estrategia de profundidad multi-capas, que permite a los administradores de red asegurarla en todos los niveles. ","imgurl": "http://cladirect.com/wp-content/uploads/bfi_thumb/Foto12-32zm4ztkntidn69e9oyyo0.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/seguridad-de-red/"}]}]};
  	var cat_apli = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_010","items": [{"title": "Aplicaciones","subtitle": "Controlar sus redes para lograr una operación más eficiente en términos de costos y productividad.","imgurl": "http://cladirect.com/wp-content/uploads/bfi_thumb/aplicaciones-32zm4zy3i41kf809nk5m9s.jpg","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/aplicaciones/"}]}]};
  	var cat_data = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_011","items": [{"title": "Data Center","subtitle": "Operamos nuestra propia red asegurando conexiones seguras y robustas, con las aplicaciones, software y nuestro equipo de servicios como el camino más rápido hacia la innovación.","imgurl": "http://cladirect.com/wp-content/uploads/bfi_thumb/ID-100388381-1-copy-1-32zm53c880fngj5t1y5bls.jpg","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/data-center-4/"}]}]};
  	
  	var cat_sera = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_012","items": [{"title": "Servicios Administrados","subtitle": "CLAdirect le permite encargarse del corazón de su negocio, mientras nos ocupamos de mantener a su empresa 100 % conectada y operativa.","imgurl": "http://cladirect.com/wp-content/uploads/2014/12/SANuestraOferta.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-administrados/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-administrados.pdf"}]}]};
  	var cat_serp = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_013","items": [{"title": "Servicios Profesionales","subtitle": "Ingenieros certificados, altamente especializados, abordan eficientemente las complejidades inherentes al diseño y gerenciamiento de todo tipo de proyectos.","imgurl": "http://cladirect.com/wp-content/uploads/2015/01/sp.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-profesionales/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-profesionales.pdf"}]}]};
    var cat_serl = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_014","items": [{"title": "Servicios Logísticos","subtitle": "Con operaciones en más de 11 países de las Américas, logramos ser el proveedor de soluciones de tecnología con mayor presencia en la región.","imgurl": "http://cladirect.com/wp-content/uploads/2016/01/stockvault-hand-of-a-businessman-holding-earth-globe-globalization-concept180134.jpg","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-logisticos/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-logisticos.pdf"}]}]};
  	var cat_sers = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_015","items": [{"title": "Servicios SDN/NFV","subtitle": "Amplio conocimiento que nos provee la habilidad de desarrollar servicios de software a la medida de los requerimientos y necesidades de nuestros clientes.","imgurl": "http://cladirect.com/wp-content/uploads/2016/06/stockvault-global-transport-and-communication180743.jpg","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-sdn-nfv/"}]}]};
  	var cat_selo = {"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_016","items": [{"title": "Servicios Locales","subtitle": "CLAdirect cuenta con un equipo de profesionales que brinda un soporte local experto, de manera ágil y efectiva.","imgurl": "http://cladirect.com/wp-content/uploads/2014/12/SLNuestraOferta.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-locales/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-locales.pdf"}]}]};
  	
  	var cat_serv = 	{"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_003","items": [
    				{"title": "Servicios Administrados","subtitle": "CLAdirect le permite encargarse del corazón de su negocio, mientras nos ocupamos de mantener a su empresa 100 % conectada y operativa.","imgurl": "http://cladirect.com/wp-content/uploads/2014/12/SANuestraOferta.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-administrados/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-administrados.pdf"} ]},
    				{"title": "Servicios Profesionales","subtitle": "Ingenieros certificados, altamente especializados, abordan eficientemente las complejidades inherentes al diseño y gerenciamiento de todo tipo de proyectos.","imgurl": "http://cladirect.com/wp-content/uploads/2015/01/sp.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-profesionales/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-profesionales.pdf"}]},
    				{"title": "Servicios Logísticos","subtitle": "Con operaciones en más de 11 países de las Américas, logramos ser el proveedor de soluciones de tecnología con mayor presencia en la región.","imgurl": "http://cladirect.com/wp-content/uploads/2016/01/stockvault-hand-of-a-businessman-holding-earth-globe-globalization-concept180134.jpg","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-logisticos/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-logisticos.pdf"}]},
  					{"title": "Servicios SDN/NFV","subtitle": "Amplio conocimiento que nos provee la habilidad de desarrollar servicios de software a la medida de los requerimientos y necesidades de nuestros clientes.","imgurl": "http://cladirect.com/wp-content/uploads/2016/06/stockvault-global-transport-and-communication180743.jpg","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-sdn-nfv/"}, ]},
					{"title": "Servicios Locales","subtitle": "CLAdirect cuenta con un equipo de profesionales que brinda un soporte local experto, de manera ágil y efectiva.","imgurl": "http://cladirect.com/wp-content/uploads/2014/12/SLNuestraOferta.png","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/servicios-locales/"}, {"type": "url", "title": "Brochure", "url": "http://cladirect.com/brochure/servicios-locales.pdf"}]},
  					{"title": "Soporte Técnico","subtitle": "CLAdirect le permite encargarse del corazón de su negocio, mientras nos ocupamos de mantener a su empresa 100 % conectada y operativa.","imgurl": "http://cladirect.com/wp-content/uploads/2015/04/tech-1.jpg","options": [{"type": "url", "title": "Saber más...", "url": "http://cladirect.com/es/soporte-tecnico/"},{"type": "url", "title": "CTAC", "url": "http://tac.cladirect.com/sr/portal/login.php"} ]}
  					]};    
    var cat_ubic = 	{"type": "catalogue","imageaspectratio": "horizontal","msgid": "cat_001","items": [
    				{"title": "Argentina","subtitle": "Reconquista 661, Piso 9B Buenos Aires (C1003ABM)","imgurl": "http://www.cladirect.com/wp-content/uploads/2017/buenos-aires.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/q9fe7FjrEAK2"}]}, 
					{"title": "Chile","subtitle": "La Concepción #81, Oficina 1904 Providencia Santiago","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/santiago.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/RWnMtNsBkUT2"}]},
					{"title": "Colombia","subtitle": "Carrera 13 #98-70, Of. 404 Bogotá","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/bogota.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/2avMau8zHxK2"}]},
					{"title": "Ecuador","subtitle": "Av. de los Shyris 41-151 e Isla FLoreana, Edificio Axios, Piso 7 Ofc. 708 Quito","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/quito.jpeg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/X4uQU2qWbPz"}]},
					{"title": "Estados Unidos","subtitle": "8600 NW 17th Street Suite 140 Miami, FL 33126","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/miami.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/jDGkATy67FH2"}]},
					{"title": "Guatemala","subtitle": "21 Avenida B 0-10 Vista Hermosa 2 zona 15 Ciudad de Guatemala","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/guatemala.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/veQaa7F6ziQ2"}]},
					{"title": "México","subtitle": "Calle Edgar Allan Poe N° 54, Colonia Polanco Reforma México, D.F","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/mexico.JPG","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/schW26ei3bw"}]},
					{"title": "Panamá","subtitle": "Calle 69 Este, San Francisco, Local 111 Ciudad de Panamá","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/panama.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/cDHBxcPkSB42"}]},
					{"title": "Perú","subtitle": "Av. La Encalada 1257 Oficina 601, Santiago de Surco Lima","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/lima.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/DXdzCZHczQ32"}]},
					{"title": "Venezuela","subtitle": "Av. Francisco de Miranda, Centro Empresarial Quorum, Piso 3, Ofic. 3C Caracas","imgurl": "http://www.cladirect.com//wp-content/uploads/2017/caracas.jpg","options": [{"type": "url", "title": "Ver Mapa", "url": "https://goo.gl/maps/eWktG9SA8wM2"}]},
					]};
    //if(event.message !== "") {
        if(event.message.toLowerCase().includes("lead")){
            context.simpledb.roomleveldata.leaddata = 1;
            if(! context.simpledb.botleveldata.leadrow)
                context.simpledb.botleveldata.leadrow = 2;
            context.simpledb.roomleveldata.leadrow = context.simpledb.botleveldata.leadrow;
            context.simpledb.botleveldata.leadrow = parseInt(context.simpledb.roomleveldata.leadrow) + 1;
            context.sendResponse("Muy bien! para registrar el Lead debo hacerte algunas preguntas, cual es el nombre del cliente?");return; 
        }
        if(event.message.toLowerCase().includes("hola") || event.message.toLowerCase().includes("empezar") || event.message.toLowerCase().includes("menu") || event.message.toLowerCase().includes("que tal") || event.message.toLowerCase().includes("menú") || event.message.toLowerCase().includes("inicio") || event.message.toLowerCase().includes("start")) {
                if(! context.simpledb.roomleveldata.name){
                    context.simpledb.roomleveldata.name = event.senderobj.display;
                    context.simpledb.roomleveldata.id = event.senderobj.channelid;
                }
                if(event.senderobj.channeltype=="fb"){
                    var xhola = {"type": "quick_reply","content": {"type": "text","text": "Hola " + event.senderobj.display.split(" ", 2)[0] + "!!, Soy el Chatbot de CLAdirect. Fui programado para ayudarte a contactarnos y solventar tus dudas. ¿Cómo podemos ayudarte? Quieres ver:"},"msgid": "salu_001","options": ["Nuestras soluciones", "Nuestros servicios", "Contactarnos", "Ver ubicaciones", "Trabajar con nosotros"]};
                    context.sendResponse(JSON.stringify(xhola)); 
                }else {
                    var xhola = {"type": "quick_reply","content": {"type": "text","text": "Hola!!, Soy el Chatbot de CLAdirect. Fui programado para ayudarte a contactarnos y solventar tus dudas. ¿Cómo podemos ayudarte? Quieres ver:"},"msgid": "salu_001","options": ["Nuestras soluciones", "Nuestros servicios", "Contactarnos", "Ver ubicaciones", "Trabajar con nosotros"]};
                    context.sendResponse(JSON.stringify(xhola));
                }
        return;
            //context.sendResponse("Hola " + event.sender + " bienvenido, en que puedo ayudarle?");
        //Aqui empieza el texto simple
        }else if(event.message.toLowerCase().includes("otras soluciones") && event.messageobj.refmsgid=='solu_001') {
                context.sendResponse(JSON.stringify(wsolu));return;
        }else if(event.message.toLowerCase().includes("servicios administrados")) {
                context.sendResponse(JSON.stringify(cat_sera));return;
        }else if(event.message.toLowerCase().includes("servicios Profesionales")) {
                context.sendResponse(JSON.stringify(cat_serp));return;
        }else if(event.message.toLowerCase().includes("servicios logísticos")) {
                context.sendResponse(JSON.stringify(cat_serl));return;
        }else if(event.message.toLowerCase().includes("servicios sdn/nfv") || event.message.toLowerCase().includes("sdn") || event.message.toLowerCase().includes("nfv")) {
                context.sendResponse(JSON.stringify(cat_sers));return;
        }else if(event.message.toLowerCase().includes("servicios locales")) {
                context.sendResponse(JSON.stringify(cat_selo));return;
        }else if(event.message.toLowerCase().includes("soluc") || event.message.toLowerCase().includes("soluciones") || event.message.toLowerCase().includes("solucion") || event.message.toLowerCase().includes("solución")) {
        		context.sendResponse(JSON.stringify(xsolu));return;
        }else if(event.message.toLowerCase().includes("serv") || event.message.toLowerCase().includes("ingen") || event.message.toLowerCase().includes("servicios") || event.message.toLowerCase().includes("servicio")){
                context.sendResponse(JSON.stringify(cat_serv));return;
        }else if(event.message.toLowerCase().includes("produc") || event.message.toLowerCase().includes("productos") || event.message.toLowerCase().includes("producto") || event.message.toLowerCase().includes("iot") || event.message.toLowerCase().includes("hardware") || event.message.toLowerCase().includes("software") || event.message.toLowerCase().includes("ofrece") || event.message.toLowerCase().includes("sdwan")) {
                context.sendResponse(JSON.stringify(xsolu));return;
        }else if(event.message.toLowerCase().includes("allot") || event.message.toLowerCase().includes("licenc") || event.message.toLowerCase().includes("renov") || event.message.toLowerCase().includes("watchguard") || event.message.toLowerCase().includes("wg") || event.message.toLowerCase().includes("juniper") || event.message.toLowerCase().includes("procera") || event.message.toLowerCase().includes("witbe") || event.message.toLowerCase().includes("plexxi") || event.message.toLowerCase().includes("citrix")) {
                context.sendResponse(JSON.stringify(xresp));return;
        }else if(event.message.toLowerCase().includes("conectividad de red") || event.message.toLowerCase().includes("router")) {
                context.sendResponse(JSON.stringify(cat_conc));return;
        }else if(event.message.toLowerCase().includes("optimización de red") || event.message.toLowerCase().includes("optimización")) {
                context.sendResponse(JSON.stringify(cat_opti));return;
        }else if(event.message.toLowerCase().includes("seguridad de red") || event.message.toLowerCase().includes("firewall") || event.message.toLowerCase().includes("seguridad")) {
                context.sendResponse(JSON.stringify(cat_segu));return;
        }else if(event.message.toLowerCase().includes("aplicaciones") || event.message.toLowerCase().includes("dpi") || event.message.toLowerCase().includes("dns")) {
                context.sendResponse(JSON.stringify(cat_apli));return;
        }else if(event.message.toLowerCase().includes("chatbot")) {
               context.sendResponse(JSON.stringify(cat_chat));return;
       	}else if(event.message.toLowerCase().includes("quality of experience") || event.message.toLowerCase().includes("qoe")) {
               context.sendResponse(JSON.stringify(cat_qoex));return;
       	}else if(event.message.toLowerCase().includes("clacloud")) {
               context.sendResponse("En CLAdirect brindamos un innovador conjunto de productos y servicios cloud administrado, a nivel empresarial, con un manejo local y soporte técnico en su idioma, además de un sevicio de migración para llevar a la nube toda la plataforma de TI de su empresa.");return;
       	}else if(event.message.toLowerCase().includes("datacenter") || event.message.toLowerCase().includes("data")) {
                context.sendResponse(JSON.stringify(cat_apli));return;
        }else if(event.message.toLowerCase().includes("sí") && event.messageobj.refmsgid=='resp_001') {
                context.sendResponse(JSON.stringify(xubic));return;
        }else if(event.message.toLowerCase().includes("sí") && event.messageobj.refmsgid=='resp_002') {
                context.sendResponse("Envíanos un correo electrónico a:\n jobs@cladirect.com\n ó consulta nuestras ofertas laborales en:\n http://cladirect.com/es/oportunidades-de-empleo/");return;
        }else if((event.message.toLowerCase().includes("no") && event.messageobj.refmsgid=='resp_001') || (event.message.toLowerCase().includes("no") && event.messageobj.refmsgid=='resp_002') ) {
                context.sendResponse(JSON.stringify(zsolu));return;
        }else if(event.message.toLowerCase().includes("empleo") || event.message.toLowerCase().includes("hoja de vida") || event.message.toLowerCase().includes("ficha") || event.message.toLowerCase().includes("cv") || event.message.toLowerCase().includes("tecnica") || event.message.toLowerCase().includes("trabaj")) {
                context.sendResponse(JSON.stringify(yresp));return;
        }else if(event.message.toLowerCase().includes("telef") || event.message.toLowerCase().includes("numer") || event.message.toLowerCase().includes("teléf") || event.message.toLowerCase().includes("númer") || event.message.toLowerCase().includes("contact")) {
                context.sendResponse(JSON.stringify(yubic));return;
        }else if(event.message.toLowerCase().includes("ubica") || event.message.toLowerCase().includes("ofici") || event.message.toLowerCase().includes("direcc") || event.message.toLowerCase().includes("locali")) {
                context.sendResponse(JSON.stringify(cat_ubic));return;
        }else if(event.message.toLowerCase().includes("argentina") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección argentina@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("caribe") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección mercadeo@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("chile") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección chile@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("colombia") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección colombia@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("ecuador") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección ecuador@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("guatemala") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección guatemala@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("méxico") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección mexico@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("panamá") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección panama@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("perú") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección peru@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("venezuela") && event.messageobj.refmsgid=='ubic_001') {
                context.sendResponse("Envíanos un correo electrónico a la dirección venezuela@cladirect.com y te responderemos a la brevedad");return;
        }else if(event.message.toLowerCase().includes("argentina") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número +54 (11) 5353-4360");return;
        }else if(event.message.toLowerCase().includes("estados unidos") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Call us now! +1 (305) 418-4253");return;
        }else if(event.message.toLowerCase().includes("chile") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número  +56 (2) 2244-4112");return;
        }else if(event.message.toLowerCase().includes("colombia") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número  +57 (1) 256-1312");return;
        }else if(event.message.toLowerCase().includes("ecuador") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número  +59 (32) 245-1303");return;
        }else if(event.message.toLowerCase().includes("guatemala") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número +502 2390 7700 ");return;
        }else if(event.message.toLowerCase().includes("méxico") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número +52 (55) 5680-4999");return;
        }else if(event.message.toLowerCase().includes("panamá") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número +507 263-3131");return;
        }else if(event.message.toLowerCase().includes("perú") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número +51 (1) 628-6973");return;
        }else if(event.message.toLowerCase().includes("venezuela") && event.messageobj.refmsgid=='ubic_002') {
                context.sendResponse("Esperamos tu llamada al número +58 (212) 238-8551");return;
        }else if(event.message.toLowerCase().includes("poc")) {
                context.sendResponse("quieres renovar o comprar una licencia?");return;
        }else if(event.message.toLowerCase().includes("quien") && event.message.toLowerCase().includes("eres")) {
                context.sendResponse("Mi nombre es CLAchat Bot, pregunta por nuestros productos y soluciones");return;
        }else if(event.message.toLowerCase().includes("compr") || event.message.toLowerCase().includes("cotiza")) {
                context.sendResponse(JSON.stringify(xsolu));return;
        }else if(event.message.toLowerCase().includes("gracia")) {
                context.sendResponse("¡De nada, estamos para servirte!");return;
        }else if(event.message.toLowerCase().includes("adio") || event.message.toLowerCase().includes("luego") || event.message.toLowerCase().includes("chao")) {
                context.sendResponse("¡Adiós, estamos para servirte!");return;
        }else if(event.message.toLowerCase().includes("sopor") || event.message.toLowerCase().includes("ayud") || event.message.toLowerCase().includes("help") || event.message.toLowerCase().includes("problem") || event.message.toLowerCase().includes("falla") || event.message.toLowerCase().includes("caida")) {
                context.sendResponse(JSON.stringify(cat_sopr));return;
        }else {
                context.sendResponse(JSON.stringify(xdefault));return;
                context.console.log(event.message.toLowerCase());
        }
    }
}
/** Functions declared below are required **/
//}
function EventHandler(context, event) {
    if(! context.simpledb.roomleveldata.name && event.senderobj.channeltype=="fb"){
        context.simpledb.roomleveldata.name = event.senderobj.display;
        context.simpledb.roomleveldata.id = event.senderobj.channelid;
    }
    numinstances = parseInt(context.simpledb.botleveldata.numinstance) + 1;
    context.simpledb.botleveldata.numinstance = numinstances;
    if(! context.simpledb.botleveldata.numinstance)
        context.simpledb.botleveldata.numinstance = 0;
    if(event.senderobj.channeltype=="fb"){
        var xresp = {"type": "quick_reply","content": {"type": "text","text": "Hola " + event.senderobj.display.split(" ", 2)[0] + "!!, Soy el Chatbot de CLAdirect. Fui programado para ayudarte a contactarnos y solventar tus dudas. ¿Cómo podemos ayudarte? Quieres ver:"},"msgid": "salu_001","options": ["Nuestras soluciones", "Nuestros servicios", "Contactarnos", "Ver ubicaciones", "Trabajar con nosotros"]};
        context.sendResponse(JSON.stringify(xresp)); 
    }else {
        var xresp = {"type": "quick_reply","content": {"type": "text","text": "Hola!!, Soy el Chatbot de CLAdirect. Fui programado para ayudarte a contactarnos y solventar tus dudas. ¿Cómo podemos ayudarte? Quieres ver:"},"msgid": "salu_001","options": ["Nuestras soluciones", "Nuestros servicios", "Contactarnos", "Ver ubicaciones", "Trabajar con nosotros"]};
        context.sendResponse(JSON.stringify(xresp));
    }
}

function HttpResponseHandler(context, event) {
    // if(event.geturl === "http://ip-api.com/json")
    var dateJson = JSON.parse(event.getresp);
    var date = dateJson.date;
    context.sendResponse("Hoy es "+date);
    //context.sendResponse(event.getresp);
}

function DbGetHandler(context, event) {
    context.sendResponse("testdbput keyword was last get by:" + event.dbval);
}

function DbPutHandler(context, event) {
    context.sendResponse("testdbput keyword was last put by:" + event.dbval);
}


//###### 
//Auto generated code from devbox
//######
 
exports.onMessage = MessageHandler;
exports.onEvent = EventHandler;
exports.onHttpResponse = HttpResponseHandler;
exports.onDbGet = DbGetHandler;
exports.onDbPut = DbPutHandler;
if(typeof LocationHandler == 'function'){exports.onLocation = LocationHandler;}
if(typeof  HttpEndpointHandler == 'function'){exports.onHttpEndpoint = HttpEndpointHandler;}
