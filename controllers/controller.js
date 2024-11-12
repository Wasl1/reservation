
const reservations = []; 
const nonReservableDays = ["2024-12-25", "2024-08-15","2024-01-01"]; 

// Fonction pour vérifier si une date est réservable
const isDateReservable = (date) => {
    const day = new Date(date).getDay();
    const formattedDate = date.split("T")[0];
    return day !== 0 && day !== 6 && !nonReservableDays.includes(formattedDate);
  };

// Fonction pour valider les données de la réservation
const validateBookingData = (user_id, subscription_type, dates) => {
    const errors = [];
    let hasDateFormatError = false; 
    let hasSubscriptionTypeError = false; 
  
    if (!user_id) {
      errors.push("user_id est manquant.");
    }
    
    const validSubscriptionTypes = ["ticket", "week", "month"];
    if (!subscription_type) {
      errors.push("subscription_type est manquant.");
    } else if (!validSubscriptionTypes.includes(subscription_type)) {
      hasSubscriptionTypeError = true;
      errors.push(`Mauvaise subscription_type. Valeurs acceptées : ${validSubscriptionTypes.join(", ")}.`);
    }
  
    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      errors.push("dates est manquant ou vide.");
    } else {
      dates.forEach(date => {
        if (isNaN(Date.parse(date))) {
          hasDateFormatError = true;
          errors.push(`Format de date invalide pour ${date}. Les dates doivent être au format ISO (ex. '2024-11-15T00:00:00.000Z').`);
        }
      });
    }

    return { errors: errors.length > 0 ? errors : null, hasDateFormatError, hasSubscriptionTypeError };
  };
  
// Fonction pour créer une réservation
export const createBooking = async (req, res) => {
    const { user_id, subscription_type, dates } = req.body;
  
    const { errors: validationErrors, hasDateFormatError, hasSubscriptionTypeError } = validateBookingData(user_id, subscription_type, dates);
    
    if (validationErrors) {
      return res.status(400).json({ 
        message: hasDateFormatError 
                  ? "Format de date invalide" 
                  : hasSubscriptionTypeError 
                  ? "Mauvaise subscription_type" 
                  : "Informations manquantes",
        error: validationErrors 
      });
    }
  
    // Vérification des dates réservables
    const nonReservableDates = dates.filter(date => !isDateReservable(date));
    if (nonReservableDates.length > 0) {
      return res.status(400).json({
        message: "Certaines dates ne sont pas réservables.",
        nonReservableDates,
      });
    }
  
    // Vérification doublons
    const isDuplicate = reservations.some(booking =>
      booking.user_id === user_id &&
      booking.subscription_type === subscription_type &&
      JSON.stringify(booking.dates) === JSON.stringify(dates)
    );
  
    if (isDuplicate) {
      return res.status(409).json({
        message: "La réservation existe déjà pour cet utilisateur avec les mêmes dates et type d'abonnement."
      });
    }

    const booking = {
      user_id,
      subscription_type,
      dates,
      booking_id: reservations.length + 1,
    };
    reservations.push(booking);

    res.status(201).json({
      message: "Réservation confirmée.",
      booking,
    });
};

// Fonction pour lister toutes les réservations
export const listBookings = (req, res) => {
  res.status(200).json({
    message: "Liste des réservations.",
    reservations,
  });
};

  


