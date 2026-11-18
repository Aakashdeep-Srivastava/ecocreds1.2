// Package carbon implements the CarbonGero carbon-accounting engine.
//
// It follows the GHG model documented in the PRD (§5.5):
//
//	GHG = Activity Data (AD) × Emission Factor (EF) × Oxidation Factor (OF)
//
// For avoided-emissions activity types (recycling, sustainable transport) the
// result is the gross estimated CO2e reduction. The net reduction then applies
// a conservative leakage discount per:
//
//	Net = Baseline − Project − Leakage − Adjustments
package carbon

// LeakageRate is a conservative discount applied to gross avoided emissions.
const LeakageRate = 0.10

// Gross computes AD × EF × OF (kg CO2e for the seeded methodologies).
func Gross(activityData, emissionFactor, oxidationFactor float64) float64 {
	return activityData * emissionFactor * oxidationFactor
}

// Net applies the leakage discount to a gross avoided-emissions figure.
func Net(gross float64) float64 {
	return gross - gross*LeakageRate
}

// Assessment is the output of a carbon calculation.
type Assessment struct {
	Baseline  float64 `json:"baselineEmissions"`
	Project   float64 `json:"projectEmissions"`
	Leakage   float64 `json:"leakage"`
	Net       float64 `json:"netReduction"`
	Unit      string  `json:"unit"`
}

// Calculate runs the full model for an avoided-emissions activity.
func Calculate(activityData, emissionFactor, oxidationFactor float64, unit string) Assessment {
	gross := Gross(activityData, emissionFactor, oxidationFactor)
	leak := gross * LeakageRate
	return Assessment{
		Baseline: gross,
		Project:  0,
		Leakage:  leak,
		Net:      gross - leak,
		Unit:     unit,
	}
}
