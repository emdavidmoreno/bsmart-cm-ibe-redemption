/* eslint-disable max-len */
'use strict'
define(['angular-translate', 'tmhDynamicLocale'], function() {
  /**
   * Angular directive that create a wrapper for jQueryUI autocomplete
   *
   * @param {Object} $translateProvider
   * @param {Object} tmhDynamicLocaleProvider
   */
  function angularConfig($translateProvider, tmhDynamicLocaleProvider) {
    // Our translations will go in here
    $translateProvider.translations('en', {
      LABEL_WELCOME: 'Welcome',
      LABEL_BOOK_YOUR_TRIP: 'Book your trip',
      LABEL_LANGUAGE: 'Language',
      LABEL_GENERIC_BODY: 'Generic body',
      LABEL_JOURNEY_TYPE: "Select your Journey type",
      LABEL_ROUND_TRIP: 'Round Trip',
      LABEL_ONE_WAY: 'One Way',
      LABEL_MULTI_CITY: 'Multi City',
      LABEL_FROM: 'From',
      LABEL_TO: 'To',
      LABEL_DEPARTURE_DATE: 'Departure',
      LABEL_FD_RETURN: 'Return',
      LABEL_FD_DEPART: 'Depart',
      LABEL_ARRIVAL_DATE: 'Return',
      LABEL_CABIN_GROUP: "Select your Journey class",
      LABEL_CABIN_ECONOMY: 'Economy Class',
      LABEL_CABIN_BUSINESS: 'Business Class',
      LABEL_PASSENGER: 'Passenger',
      LABEL_ADULT: 'Adult',
      LABEL_ADULTS: 'Adults',
      LABEL_PASSENGER_ADULT: 'Adult +12',
      LABEL_PASSENGER_CHILD: 'Child 2-11',
      LABEL_PASSENGER_INFANT: 'Infant 0-1',
      LABEL_SEARCH: 'Search',
      LABEL_CONTINUE: 'Continue',
      LABEL_PASSENGER_QUESTION: 'Travelling with children?',
      LABEL_NOT_FLEXIBLE_SEARCH: 'I must travel on these dates',
      LABEL_FLEXIBLE_SEARCH: 'My travel dates are flexible',
      LABEL_COUPON: 'Do you have a coupon?',
      LABEL_MONTH_JANUARY: 'January',
      LABEL_MONTH_FEBRUARY: 'February',
      LABEL_MONTH_MARCH: 'March',
      LABEL_MONTH_APRIL: 'April',
      LABEL_MONTH_MAY: 'May',
      LABEL_MONTH_JUNE: 'June',
      LABEL_MONTH_JULY: 'July',
      LABEL_MONTH_AUGUST: 'August',
      LABEL_MONTH_SEPTEMBRE: 'September',
      LABEL_MONTH_OCTOBER: 'October',
      LABEL_MONTH_NOVEMBER: 'November',
      LABEL_MONTH_DECEMBER: 'December',
      LABEL_CURRENCY: 'Currency',
      LABEL_FLIGHT: 'Flight',
      LABEL_FLIGHT_DOIT_OUTBOUND: 'Choose Outbound',
      LABEL_FLIGHT_DOIT_INBOUND: 'Choose Inbound',
      LABEL_FLIGHT_DOIT_FLIGHT: 'Choose Flight',
      LABEL_FLIGHT_NO_STOPS: 'No Stop',
      LABEL_FLIGHT_STOPS: 'Stop',
      LABEL_FLIGHT_INBOUND: 'Inbound flight',
      LABEL_FLIGHT_OUTBOUND: 'Outbound flight',
      LABEL_ITINERARY_SUMMARY: 'Itinerary Summary',
      LABEL_BASE_PRICE: 'Base Price',
      LABEL_TAXES: 'Taxes',
      LABEL_FUEL_SUBCHARGES: 'Fuel Subcharges',
      LABEL_TOTAL: 'Total',
      LABEL_CHOOSE_PAYMENT_TYPE: 'Choose the payment type',
      LABEL_PROCEED_PAY: 'Proceed to pay',
      LABEL_RESERVE_HOLD_ITINERARY: 'Reserve and hold my itinerary for 48 hours',
      LABEL_PASSENGER_INFO: 'Passenger Information',
      LABEL_TITLE: 'Title',
      LABEL_AUTO_FILL_OPTIONS: 'Auto Fill Options',
      LABEL_FIRST_NAME: 'First Name(s)',
      LABEL_LAST_NAME: 'Last Name(s)',
      LABEL_AGE: 'Age (yrs)',
      LABEL_FREQUENT_FLYER: 'Frequent Flyer',
      LABEL_MEMBERSHIP: 'Membership #',
      LABEL_GENDER: 'Gender',
      LABEL_MALE: 'Male',
      LABEL_FEMALE: 'Female',
      LABEL_BIRTHDAY: 'Birthday',
      LABEL_REDRESS_NUMBER: 'Redress Number',
      LABEL_CONTACT_INFORMATION: 'Contact information',
      LABEL_EMAIL: 'Email',
      LABEL_CONFIRM_EMAIL: 'Confirm Email',
      LABEL_PHONE_NUMBER: 'Phone Number',
      LABEL_BASE: 'Base',
      LABEL_BILLING_INFO: 'Billing information',
      LABEL_IMPORTANT: 'Important',
      LABEL_CARD_INFO: 'Card information',
      LABEL_CARD_TYPE: 'Card type',
      LABEL_CARD_ISSUING_COUNTRY: 'Card Issuing Country',
      LABEL_CARD_CURRENCY: 'Card Currency',
      LABEL_CARD_NUMBER: 'Card Number',
      LABEL_INSTALLMENTS: 'Installments',
      LABEL_INSURANCE: 'Insurance',
      LABEL_CARDHOLDER_NAME: 'Cardholder\'s Name',
      LABEL_CARDHOLDER_PHONE: 'Cardholder\'s Phone',
      LABEL_EXPIATION_DATE: 'Expiration Date',
      LABEL_DOCUMENT_NUMBER: 'Document Number (CC)',
      LABEL_DOCUMENT_ID: 'Document ID (NIT/RUC/DNI)',
      LABEL_SECURITY_CODE: 'Security Code',
      LABEL_CARDHOLDER_EMAIL: 'Cardholder\'s email',
      LABEL_BILLING_ADDRESS: 'Billing Address',
      LABEL_ADDRESS_LINE_1: 'Address Line 1',
      LABEL_ADDRESS_LINE_2: 'Address Line 2',
      LABEL_CITY: 'City',
      LABEL_COUNTRY: 'Country',
      LABEL_STATE: 'State/Province',
      LABEL_POSTAL_ZIP_CODE: 'Postal/Zip Code',
      LABEL_RESTRICTED_ITEMS: 'Restricted Items',
      LABEL_PURCHASE: 'Purchase',
      LABEL_TERM_CONDITION: 'Terms and conditions/ Fare Rules',
      LABEL_PROMO_CODE: 'Coupon code?',
      LABEL_HOME: 'Home',
      LABEL_BAGAGGE_POLICE: 'Copa Bagagge Police',
      LABEL_PARTNER_BAGAGGE_POLICE: 'Partner Bagagge Police',
      LABEL_DESKTOP_VERSION: 'Desktop Version',
      LABEL_NEW_SEARCH: 'New Search',
      LABEL_SEND: 'Send',
      LABEL_PASSENGERS: 'Passengers',
      LABEL_ITENERARY_CONFIRMATION: 'Itinerary Confirmation',
      LABEL_CONFIRMATION_EMAIL: 'Confirmation Email',
      LABEL_SUMMARY_CLOSE_TITLE: 'Change flight',
      LABEL_PASSENGER_INFANT_ERROR: 'Each infant traveller must be accompanied by adult traveller',
      LABEL_READ_MORE: 'Read More',
      LABEL_REVIEW_YOUR_ITINERARY_AND_PRICE: 'Review your itinerary and price',
      LABEL_NOT_AVAILABLE_FLIGTHS_IN_SELECTED_DATE: 'There are no flights available on this date.',
      LABEL_TOTAL_FARE: 'Total Fare',
      LABEL_FIRST_NAME_EXAMPLE: 'First Name',
      LABEL_LAST_NAME_EXAMPLE: 'Last Name',
      LABEL_EMAIL_EXAMPLE: 'user@email.com',
      LABEL_COUNTRY_CODE: 'country code',
      LABEL_NUMBER: 'telephone number',
      LABEL_LOGIN: 'Login',
      LABEL_MMB: 'Manage your booking',
      LABEL_EXACT_DATE: 'Exact date',
      LABEL_FLEXIBLE_DATE: 'Flexible Dates',
      LABEL_RETURN_OPTION: 'Back',
      LABEL_EDIT_OPTION: 'Edit',
      LABEL_DELETE_OPTION: 'Delete',
      LABEL_CARD_SAVED: 'Saved cards',
      LABEL_ADD_OPTION: 'Add',
      LABEL_TRIP_MSG: 'This trip will not be automatically added to the App. You may add it manually after payment.',
      LABEL_DEBIT_CARD_ISSUE_COLOMBIA: 'Debit cards issued in Colombia',
      LABEL_BANK_TRANSFER: 'Bank Transfer',
      LABEL_BOLETO_BANCARIO: 'Boleto Bancario',
      LABEL_SEAT: 'Seat',
      LABEL_BUY:'Buy',
      LABEL_AUTOCOMPLETE_FROM: "Search origin city. After typing 3 letters use up and down arrows to select from list",
      LABEL_AUTOCOMPLETE_TO: "Search destination city. After typing 3 letters use up and down arrows to select from list",
      LABEL_DEPART_DATE:"Departing date",
      LABEL_RETURN_DATE:"Returning date",
      LABEL_FLIGHT_CLASS_INFO: "Extra information",
      LABEL_DATEPICKER_DEPARTURE_FORMAT: "Departing Date. Type in the date format using 2 numbers for day and month, and 4" +
      " numbers for the year in the following order month/day/year. The date must be gr" +
        "eater than or equal to the current date.",
      LABEL_DATEPICKER_RETURN_FORMAT: "Returning Date. Type in the date format using 2 numbers for day and month, and 4" +
      " numbers for the year in the following order month/day/year. The date must be gr" +
        "eater than or equal to the current date.",
    })


    // spanish translations
    $translateProvider.translations('es', {
      LABEL_WELCOME: 'Bienvenido',
      LABEL_BOOK_YOUR_TRIP: 'Reserve su viaje',
      LABEL_LANGUAGE: 'Idioma',
      LABEL_GENERIC_BODY: 'Contenedor genérico',
      LABEL_JOURNEY_TYPE: "Seleccione su tipo de viaje",
      LABEL_ROUND_TRIP: 'Ida y vuelta',
      LABEL_ONE_WAY: 'Sólo ida',
      LABEL_MULTI_CITY: 'Multi-ciudad',
      LABEL_FROM: 'Desde',
      LABEL_TO: 'Hacia',
      LABEL_DEPARTURE_DATE: 'Fecha de Salida',
      LABEL_ARRIVAL_DATE: 'Fecha de regreso',
      LABEL_FD_RETURN: 'Regreso',
      LABEL_FD_DEPART: 'Salida',
      LABEL_CABIN_GROUP: "Selecione la clase de su viaje",
      LABEL_CABIN_ECONOMY: 'Clase Económica',
      LABEL_CABIN_BUSINESS: 'Clase Ejecutiva',
      LABEL_PASSENGER: 'Pasajeros',
      LABEL_ADULT: 'Adulto',
      LABEL_ADULTS: 'Adultos',
      LABEL_PASSENGER_ADULT: 'Adulto 12+',
      LABEL_PASSENGER_CHILD: 'Niños 2-11',
      LABEL_PASSENGER_INFANT: 'Infantes 0-1',
      LABEL_SEARCH: 'Buscar',
      LABEL_CONTINUE: 'Continuar',
      LABEL_PASSENGER_QUESTION: '¿Viajan con niños?',
      LABEL_NOT_FLEXIBLE_SEARCH: 'Fechas exactas',
      LABEL_FLEXIBLE_SEARCH: 'Fechas flexibles',
      LABEL_COUPON: '¿Tiene un código promocional?',
      LABEL_MONTH_JANUARY: 'Enero',
      LABEL_MONTH_FEBRUARY: 'Febrero',
      LABEL_MONTH_MARCH: 'Marzo',
      LABEL_MONTH_APRIL: 'Abril',
      LABEL_MONTH_MAY: 'Mayo',
      LABEL_MONTH_JUNE: 'Junio',
      LABEL_MONTH_JULY: 'Julio',
      LABEL_MONTH_AUGUST: 'Agosto',
      LABEL_MONTH_SEPTEMBRE: 'Septiembre',
      LABEL_MONTH_OCTOBER: 'Octubre',
      LABEL_MONTH_NOVEMBER: 'Noviembre',
      LABEL_MONTH_DECEMBER: 'Diciembre',
      LABEL_CURRENCY: 'Moneda',
      LABEL_FLIGHT: 'Vuelo',
      LABEL_FLIGHT_DOIT_OUTBOUND: 'Vuelo salida',
      LABEL_FLIGHT_DOIT_INBOUND: 'Vuelo regreso',
      LABEL_FLIGHT_DOIT_FLIGHT: 'Escoja vuelo',
      LABEL_FLIGHT_NO_STOPS: 'Sin escala',
      LABEL_FLIGHT_STOPS: 'Escala',
      LABEL_FLIGHT_INBOUND: 'Vuelo regreso',
      LABEL_FLIGHT_OUTBOUND: 'Vuelo salida',
      LABEL_ITINERARY_SUMMARY: 'Resumen de itinerario',
      LABEL_BASE_PRICE: 'Precio base',
      LABEL_TAXES: 'Impuestos',
      LABEL_FUEL_SUBCHARGES: 'Recargos de combustible',
      LABEL_TOTAL: 'Total',
      LABEL_CHOOSE_PAYMENT_TYPE: '¿Cómo desea proceder?',
      LABEL_PROCEED_PAY: 'Pagar ahora',
      LABEL_RESERVE_HOLD_ITINERARY: 'Reservar y guardar mi itinerario por 48 horas',
      LABEL_PASSENGER_INFO: 'Información de pasajeros',
      LABEL_TITLE: 'Título',
      LABEL_AUTO_FILL_OPTIONS: 'Opciones de relleno automático',
      LABEL_FIRST_NAME: 'Nombre(s)',
      LABEL_LAST_NAME: 'Apellidos(s)',
      LABEL_AGE: 'Edad (años)',
      LABEL_FREQUENT_FLYER: 'Viajero frecuente',
      LABEL_MEMBERSHIP: 'Afiliación #',
      LABEL_GENDER: 'Sexo',
      LABEL_MALE: 'Hombre',
      LABEL_FEMALE: 'Mujer',
      LABEL_BIRTHDAY: 'Cumpleaños',
      LABEL_REDRESS_NUMBER: 'Número de Desagravio',
      LABEL_CONTACT_INFORMATION: 'Información del contacto',
      LABEL_EMAIL: 'Correo electrónico',
      LABEL_CONFIRM_EMAIL: 'Confirmar correo electrónico',
      LABEL_PHONE_NUMBER: 'Número de teléfono',
      LABEL_BASE: 'Base',
      LABEL_BILLING_INFO: 'Datos de facturación',
      LABEL_IMPORTANT: 'Importante',
      LABEL_CARD_INFO: 'Información de tarjeta',
      LABEL_CARD_TYPE: 'Tipo de tarjeta',
      LABEL_CARD_ISSUING_COUNTRY: 'Tarjeta emitida en',
      LABEL_CARD_CURRENCY: 'Moneda',
      LABEL_INSTALLMENTS: 'Cuotas',
      LABEL_INSURANCE: 'Seguro',
      LABEL_CARDHOLDER_NAME: 'Nombre del dueño de la tarjeta',
      LABEL_EXPIATION_DATE: 'Fecha de expiración',
      LABEL_CARD_NUMBER: 'Número de tarjeta',
      LABEL_DOCUMENT_NUMBER: 'Cédula (CC)',
      LABEL_DOCUMENT_ID: 'Document ID (NIT/RUC/DNI)',
      LABEL_SECURITY_CODE: 'Código de seguridad',
      LABEL_CARDHOLDER_EMAIL: 'Correo electrónico del dueño de la tarjeta',
      LABEL_CARDHOLDER_PHONE: 'Teléfono del Tarjetahabiente',
      LABEL_BILLING_ADDRESS: 'Dirección de facturación',
      LABEL_ADDRESS_LINE_1: 'Dirección (1)',
      LABEL_ADDRESS_LINE_2: 'Dirección (2)',
      LABEL_CITY: 'Ciudad',
      LABEL_COUNTRY: 'País',
      LABEL_STATE: 'Estado/Provincia',
      LABEL_POSTAL_ZIP_CODE: 'Código Postal',
      LABEL_RESTRICTED_ITEMS: 'Artículos Restringidos',
      LABEL_PURCHASE: 'Comprar',
      LABEL_TERM_CONDITION: 'Términos y condiciones / Reglas de tarifa',
      LABEL_PROMO_CODE: 'Código promocional?',
      LABEL_HOME: 'Inicio',
      LABEL_BAGAGGE_POLICE: 'Copa Política de equipaje',
      LABEL_PARTNER_BAGAGGE_POLICE: 'Socios Política de equipaje',
      LABEL_DESKTOP_VERSION: 'Versión Escritorio',
      LABEL_NEW_SEARCH: 'Nueva Búsqueda',
      LABEL_SEND: 'Enviar',
      LABEL_PASSENGERS: 'Pasajeros',
      LABEL_ITENERARY_CONFIRMATION: 'Confirmación de Itinerario',
      LABEL_CONFIRMATION_EMAIL: 'E-mail de Confirmación',
      LABEL_SUMMARY_CLOSE_TITLE: 'Cambiar vuelo',
      LABEL_PASSENGER_INFANT_ERROR: 'Cada infante debe estar acompañado de un adulto cuando viaja',
      LABEL_READ_MORE: 'Leer Más',
      LABEL_REVIEW_YOUR_ITINERARY_AND_PRICE: 'Revise itinerario y precio',
      LABEL_NOT_AVAILABLE_FLIGTHS_IN_SELECTED_DATE: 'No hay disponibilidad en los vuelos en la fecha seleccionada.',
      LABEL_TOTAL_FARE: 'Tarifa Total',
      LABEL_FIRST_NAME_EXAMPLE: 'Nombre(s)',
      LABEL_LAST_NAME_EXAMPLE: 'Apellido(s)',
      LABEL_EMAIL_EXAMPLE: 'usuario@email.com',
      LABEL_COUNTRY_CODE: 'cód. país',
      LABEL_NUMBER: 'número de teléfono',
      LABEL_LOGIN: 'Entrar',
      LABEL_MMB: 'Maneje su reserva',
      LABEL_EXACT_DATE: 'Fechas Exactas',
      LABEL_FLEXIBLE_DATE: 'Fechas Flexibles',
      LABEL_RETURN_OPTION: 'Regresar',
      LABEL_EDIT_OPTION: 'Editar',
      LABEL_DELETE_OPTION: 'Eliminar',
      LABEL_CARD_SAVED: 'Tarjetas guardadas',
      LABEL_ADD_OPTION: 'Agregar',
      LABEL_TRIP_MSG: 'Este viaje no será agregado automáticamente al App. Lo podrá agregar posterior al pago.',
      LABEL_DEBIT_CARD_ISSUE_COLOMBIA: 'Débitos a Cuentas de Ahorro/Corriente emitidas en Colombia.',
      LABEL_BANK_TRANSFER: 'Transferencia bancaria',
      LABEL_BOLETO_BANCARIO: 'Boleto Bancário',
      LABEL_SEAT: 'Asiento',
      LABEL_BUY:'Comprar',
      LABEL_AUTOCOMPLETE_FROM: "Buscar ciudad de origen. Después de escribir 3 letras, use las flechas hacia arriba y hacia abajo para seleccionar de la lista",
      LABEL_AUTOCOMPLETE_TO: "Buscar ciudad de destino. Después de escribir 3 letras, use las flechas hacia arriba y hacia abajo para seleccionar de la lista",
      LABEL_DEPART_DATE:"Fecha de salida",
      LABEL_RETURN_DATE:"Fecha de retorno",
      LABEL_FLIGHT_CLASS_INFO: "Información extra",
      LABEL_DATEPICKER_DEPARTURE_FORMAT: "Fecha de salida. Escriba el formato de fecha usando 2 números para el día y" +
      " el mes y 4 números para el año en el siguiente orden mes / día / año. La fecha de" +
        "be ser mayor o igual que la fecha actual.",
      LABEL_DATEPICKER_RETURN_FORMAT: "Fecha de retorno. Escriba el formato de fecha usando 2 números para el día y" +
      " el mes y 4 números para el año en el siguiente orden mes / día / año. La fecha de" +
        "be ser mayor o igual que la fecha actual.",
    })

    // portuguees translations
    $translateProvider.translations('pt', {
      LABEL_WELCOME: 'Bem vinda',
      LABEL_BOOK_YOUR_TRIP: 'Reserve a sua viagem',
      LABEL_LANGUAGE: 'Language',
      LABEL_GENERIC_BODY: 'Body genérico',
      LABEL_JOURNEY_TYPE: "Selecione seu tipo de viagem",
      LABEL_ROUND_TRIP: 'Ida e volta',
      LABEL_ONE_WAY: 'Somente ida',
      LABEL_MULTI_CITY: 'Múltiplas cidades',
      LABEL_FROM: 'De',
      LABEL_TO: 'Para',
      LABEL_DEPARTURE_DATE: 'Data de Partida',
      LABEL_ARRIVAL_DATE: 'Data de regresso',
      LABEL_FD_RETURN: 'Regresso',
      LABEL_FD_DEPART: 'Partida',
      LABEL_CABIN_GROUP: "Selecione sua classe de viagem",
      LABEL_CABIN_ECONOMY: 'Classe Económica',
      LABEL_CABIN_BUSINESS: 'Classe Executiva',
      LABEL_PASSENGER: 'Passageiros',
      LABEL_ADULT: 'Adulto',
      LABEL_ADULTS: 'Adultos',
      LABEL_PASSENGER_ADULT: 'Adulto 12+',
      LABEL_PASSENGER_CHILD: 'Crianças 2-11',
      LABEL_PASSENGER_INFANT: 'Bebés 0-1',
      LABEL_SEARCH: 'Buscar',
      LABEL_CONTINUE: 'Continuar',
      LABEL_PASSENGER_QUESTION: 'Viajando com crianças?',
      LABEL_NOT_FLEXIBLE_SEARCH: 'Datas exactas',
      LABEL_FLEXIBLE_SEARCH: 'Datas flexíveis',
      LABEL_COUPON: 'Possui um código promocional?',
      LABEL_MONTH_JANUARY: 'Janeiro',
      LABEL_MONTH_FEBRUARY: 'Fevereiro',
      LABEL_MONTH_MARCH: 'Março',
      LABEL_MONTH_APRIL: 'Abril',
      LABEL_MONTH_MAY: 'Maio',
      LABEL_MONTH_JUNE: 'Junho',
      LABEL_MONTH_JULY: 'Julho',
      LABEL_MONTH_AUGUST: 'Agosto',
      LABEL_MONTH_SEPTEMBRE: 'Setembro',
      LABEL_MONTH_OCTOBER: 'Outubro',
      LABEL_MONTH_NOVEMBER: 'Novembro',
      LABEL_MONTH_DECEMBER: 'Dezembro',
      LABEL_CURRENCY: 'Moeda',
      LABEL_FLIGHT: 'Voar',
      LABEL_FLIGHT_DOIT_OUTBOUND: 'Vôo de partida',
      LABEL_FLIGHT_DOIT_INBOUND: 'Vôo de regresso',
      LABEL_FLIGHT_DOIT_FLIGHT: 'Escolha voo',
      LABEL_FLIGHT_NO_STOPS: 'Sem escala',
      LABEL_FLIGHT_STOPS: 'Escala',
      LABEL_FLIGHT_INBOUND: 'Voo entrada',
      LABEL_FLIGHT_OUTBOUND: 'Voo de ida',
      LABEL_ITINERARY_SUMMARY: 'Resumo do itinerário',
      LABEL_BASE_PRICE: 'Preço base',
      LABEL_TAXES: 'Impostos',
      LABEL_FUEL_SUBCHARGES: 'Sobretaxas de combustível',
      LABEL_TOTAL: 'Total',
      LABEL_CHOOSE_PAYMENT_TYPE: 'Como deseja proceder?',
      LABEL_PROCEED_PAY: 'Pagar agora',
      LABEL_RESERVE_HOLD_ITINERARY: 'Reservar e guardar meu itinerário por 48 horas',
      LABEL_PASSENGER_INFO: 'Detalhe do passageiro(s)',
      LABEL_TITLE: 'Forma de tratamento',
      LABEL_AUTO_FILL_OPTIONS: 'Opções de preenchimento automático',
      LABEL_FIRST_NAME: 'Nome (s)',
      LABEL_LAST_NAME: 'Sobrenome (s)',
      LABEL_AGE: 'Idade (anos)',
      LABEL_FREQUENT_FLYER: 'Passageiro Freqüente',
      LABEL_MEMBERSHIP: 'Membership #',
      LABEL_GENDER: 'Gênero',
      LABEL_MALE: 'Masculino',
      LABEL_FEMALE: 'Fêmea',
      LABEL_BIRTHDAY: 'Aniversário',
      LABEL_REDRESS_NUMBER: 'Número reparação',
      LABEL_CONTACT_INFORMATION: 'Informações de contato.',
      LABEL_EMAIL: 'Endereço de e-mail',
      LABEL_CONFIRM_EMAIL: 'Confirmar e-mail',
      LABEL_PHONE_NUMBER: 'Número de telefone',
      LABEL_BASE: 'Base',
      LABEL_BILLING_INFO: 'Informações de pagamento',
      LABEL_IMPORTANT: 'Importante',
      LABEL_CARD_INFO: 'Informações do cartão',
      LABEL_CARD_TYPE: 'Tipo de cartão',
      LABEL_CARD_ISSUING_COUNTRY: 'Cartão emitida em',
      LABEL_CARD_CURRENCY: 'Moeda',
      LABEL_INSTALLMENTS: 'Cota',
      LABEL_CARD_NUMBER: 'Número de cartão',
      LABEL_CARDHOLDER_NAME: 'Nome do titular do cartão',
      LABEL_EXPIATION_DATE: 'Data de validade',
      LABEL_DOCUMENT_NUMBER: 'Cédula (CC)',
      LABEL_DOCUMENT_ID: 'Document ID (NIT/RUC/DNI)',
      LABEL_SECURITY_CODE: 'Código de segurança',
      LABEL_CARDHOLDER_EMAIL: 'Endereço de e-mail do titular do cartão',
      LABEL_CARDHOLDER_PHONE: 'Telefone do titular do cartão',
      LABEL_BILLING_ADDRESS: 'Endereço de faturação',
      LABEL_ADDRESS_LINE_1: 'Endereço (1)',
      LABEL_ADDRESS_LINE_2: 'Endereço (2)',
      LABEL_CITY: 'Cidade',
      LABEL_COUNTRY: 'País',
      LABEL_STATE: 'Estado/Província',
      LABEL_POSTAL_ZIP_CODE: 'CEP',
      LABEL_RESTRICTED_ITEMS: 'Artigos Restringidos',
      LABEL_PURCHASE: 'Comprar',
      LABEL_TERM_CONDITION: 'Termos e condições / Regras de tarifa',
      LABEL_PROMO_CODE: 'Código promocional?',
      LABEL_HOME: 'Inicio',
      LABEL_BAGAGGE_POLICE: 'Copa Políticas de bagagem',
      LABEL_PARTNER_BAGAGGE_POLICE: 'Socios Políticas de bagagem',
      LABEL_DESKTOP_VERSION: 'Versão para desktop',
      LABEL_NEW_SEARCH: 'Nova Busca',
      LABEL_SEND: 'Enviar',
      LABEL_PASSENGERS: 'Passageiros',
      LABEL_ITENERARY_CONFIRMATION: 'Confirmação da Viagem',
      LABEL_CONFIRMATION_EMAIL: 'E-mail de confirmação',
      LABEL_SUMMARY_CLOSE_TITLE: 'Alteração de voo',
      LABEL_PASSENGER_INFANT_ERROR: 'Todo bebê deve estar acompanhado de um adulto durante a viajem',
      LABEL_READ_MORE: 'Leia Mais',
      LABEL_REVIEW_YOUR_ITINERARY_AND_PRICE: 'Rever o seu itinerário e preço',
      LABEL_NOT_AVAILABLE_FLIGTHS_IN_SELECTED_DATE: 'Não há disponibilidade nos vôos na data selecionad.',
      LABEL_TOTAL_FARE: 'Tarifa Total',
      LABEL_FIRST_NAME_EXAMPLE: 'Primeiro nome',
      LABEL_LAST_NAME_EXAMPLE: 'Último nome',
      LABEL_EMAIL_EXAMPLE: 'nome de usuário@email.com',
      LABEL_COUNTRY_CODE: 'código de país',
      LABEL_NUMBER: 'número de telefone',
      LABEL_LOGIN: 'Acceda a su cuenta',
      LABEL_MMB: 'Administre a sua reserva',
      LABEL_INSURANCE: 'Seguro',
      LABEL_EXACT_DATE: 'Datas Exatas',
      LABEL_FLEXIBLE_DATE: 'Datas Flexíveis',
      LABEL_RETURN_OPTION: 'Voltar',
      LABEL_EDIT_OPTION: 'Editar',
      LABEL_DELETE_OPTION: 'Excluir',
      LABEL_CARD_SAVED: 'Cartões Saved',
      LABEL_ADD_OPTION: 'Adicionar',
      LABEL_TRIP_MSG: 'Esta viagem não será adicionado automaticamente para o App. Você pode adicioná-lo manualmente após o pagamento.',
      LABEL_DEBIT_CARD_ISSUE_COLOMBIA: 'Depósitos contas de poupança / corrente emitido na Colômbia.',
      LABEL_BANK_TRANSFER: 'Transferência bancária',
      LABEL_BOLETO_BANCARIO: 'Boleto Bancario',
      LABEL_SEAT:'Assento',
      LABEL_BUY:'Comprar',
      LABEL_AUTOCOMPLETE_FROM: "Pesquisar cidade de origem. Depois de digitar 3 letras, use as setas para cima e para baixo para selecionar da lista",
      LABEL_AUTOCOMPLETE_TO: "Pesquisar cidade de destino. Depois de digitar 3 letras, use as setas para cima e para baixo para selecionar da lista",
      LABEL_DEPART_DATE:"Data de partida",
      LABEL_RETURN_DATE:"Data de retorno",
      LABEL_FLIGHT_CLASS_INFO: "Informação extra",
      LABEL_DATEPICKER_DEPARTURE_FORMAT: "Data de partida. Digite o formato da data usando 2 números por dia e mês e 4 " +
      "números para o ano na ordem seguinte mês / dia / ano. O data deve ser maior ou ig" +
        "ual a data atual.",
      LABEL_DATEPICKER_RETURN_FORMAT: "Data de retorno. Digite o formato da data usando 2 números por dia e mês e 4 " +
      "números para o ano na ordem seguinte mês / dia / ano. O data deve ser maior ou ig" +
        "ual a data atual.",
    })

    // set default language
    $translateProvider.preferredLanguage('en')
    $translateProvider.useSanitizeValueStrategy('escape')

    tmhDynamicLocaleProvider.localeLocationPattern('//@@HOST/app/modules/bsmart-cm-ibe/lib/angular/i18n/angular-locale_{{locale}}.js')
  }

  angularConfig.$inject = ['$translateProvider', 'tmhDynamicLocaleProvider']

  return angularConfig
})
